from fastapi import FastAPI, HTTPException
from pymongo import MongoClient, errors
from pydantic import BaseModel
import json
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import time
import os
import logging
from pygrok import Grok
import logging
# import logstash

uri = os.environ.get('URI')

origins = [
    "http://localhost:3000", 
    "http://localhost:5173"
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection setup
client = None
db = None
collection = None

class Item(BaseModel):
    title: str
    description: str
    tldr: str
    url: str
    techstack: str

# Set up logger
# logstash_host = os.getenv('LOGSTASH_HOST', 'localhost')
# logger.addHandler(logstash.LogstashHandler(logstash_host, 5000, version=1))
    

# def format_log_message(level, message):
#     grok = Grok("%{LOGLEVEL:level} %{GREEDYDATA:message} %{TIMESTAMP_ISO8601:timestamp}")
#     timestamp = time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime())
#     log_message = f"{timestamp} {level} {message}"
#     return grok.match(log_message)

# logger = logging.getLogger('python-logstash-logger')
# logger.setLevel(logging.DEBUG)  # Set level to DEBUG to capture all levels of logs
# file_handler = logging.FileHandler('app.log')
# logger.addHandler(file_handler)
    

class LevelFilter(logging.Filter):
    def __init__(self, level):
        self.level = level

    def filter(self, record):
        return record.levelno == self.level

# Add the filters to the handlers
debug_filter = LevelFilter(logging.DEBUG)
info_filter = LevelFilter(logging.INFO)
warn_filter = LevelFilter(logging.WARNING)
error_filter = LevelFilter(logging.ERROR)

logger = logging.getLogger('python-logstash-logger')
logger.setLevel(logging.DEBUG)  # Set level to DEBUG to capture all levels of logs

# Create file handlers for each log level

log_directory = '/app/logs'
os.makedirs(log_directory, exist_ok=True)

debug_handler = logging.FileHandler(os.path.join(log_directory, 'debug.log'))
info_handler = logging.FileHandler(os.path.join(log_directory, 'info.log'))
warn_handler = logging.FileHandler(os.path.join(log_directory, 'warn.log'))
error_handler = logging.FileHandler(os.path.join(log_directory, 'error.log'))

debug_handler.addFilter(debug_filter)
info_handler.addFilter(info_filter)
warn_handler.addFilter(warn_filter)
error_handler.addFilter(error_filter)

# Create formatters for the log messages
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

# Set the formatter for each handler
debug_handler.setFormatter(formatter)
info_handler.setFormatter(formatter)
warn_handler.setFormatter(formatter)
error_handler.setFormatter(formatter)

# Set the log level for each handler
debug_handler.setLevel(logging.DEBUG)
info_handler.setLevel(logging.INFO)
warn_handler.setLevel(logging.WARNING)
error_handler.setLevel(logging.ERROR)

# # Create formatters for the log messages
# formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
# debug_handler.setFormatter(formatter)
# info_handler.setFormatter(formatter)
# warn_handler.setFormatter(formatter)
# error_handler.setFormatter(formatter)

# Add the handlers to the logger
logger.addHandler(debug_handler)
logger.addHandler(info_handler)
logger.addHandler(warn_handler)
logger.addHandler(error_handler)

@app.on_event("startup")
async def startup_event():
    global client, db, collection
    attempts = 0
    while not client:
        try:
            client = MongoClient(uri, serverSelectionTimeoutMS=5000)
            client.admin.command('ismaster')
            db = client.projects
            collection = db.displayProjects
            logger.info("Connected to MongoDB")
            #logger.info(format_log_message("INFO", "Connected to MongoDB"))
        except errors.ServerSelectionTimeoutError as err:
            attempts += 1
            if attempts <= 5:
                logger.warn(f"Attempt #{attempts} to connect to MongoDB failed. Retrying in 5 seconds...")
                # logger.warn(format_log_message("WARN", f"Attempt #{attempts} to connect to MongoDB failed. Retrying in 5 seconds..."))
                time.sleep(5)
            else:
                logger.error("Could not connect to MongoDB after 5 attempts. Exiting...")
                # logger.error(format_log_message("ERROR", "Could not connect to MongoDB after 5 attempts. Exiting..."))
                raise err

    if collection.count_documents({}) == 0:
        with open('projects.json') as f:
            data = json.load(f)
        
        for item in data:
            try:
                collection.insert_one(item)
                logger.debug(f"Inserted item: {item['title']}")
                # logger.debug(format_log_message("DEBUG", f"Inserted item: {item['title']}"))
            except errors.DuplicateKeyError:
                # logger.warn(format_log_message("WARN", f"Duplicate item: {item['title']}"))
                logger.warn(f"Duplicate item: {item['title']}")
                pass

        collection.create_index("title", unique=True)

app.add_event_handler("startup", startup_event)

def item_helper(item) -> dict:
    return {
        "id": str(item["_id"]),
        "title": item["title"],
        "description": item["description"],
        "tldr": item["tldr"],
        "url": item["url"],
        "techstack": item["techstack"]
    }

@app.get("/items/")
async def read_items():
    items = collection.find()
    data = [item_helper(item) for item in items]
    # logger.debug(format_log_message("DEBUG", f"Read {len(data)} items"))
    logger.debug(f"Read {len(data)} items")
    return {"items": data}

@app.post("/items/")
async def create_item(item: Item):
    try:
        collection.insert_one(item.dict())
        logger.info(f"Created item: {item.title}")
        # logger.info(format_log_message("INFO", f"Created item: {item.title}"))
        return {"message": "Item has been added successfully"}
    except errors.DuplicateKeyError:
        logger.warn(f"Attempted to create duplicate item: {item.title}")
        # logger.warn(format_log_message("WARN", f"Attempted to create duplicate item: {item.title}"))
        raise HTTPException(status_code=400, detail="Duplicate item")

@app.get("/items/{item_title}")
async def read_item(item_title: str):
    item = collection.find_one({"title": item_title})
    if item is not None:
        logger.debug(f"Read item: {item_title}")
        # logger.debug(format_log_message("DEBUG", f"Read item: {item_title}"))
        return item_helper(item)
    else:
        logger.warn(f"Attempted to read non-existent item: {item_title}")
        # logger.warn(format_log_message("WARN", f"Attempted to read non-existent item: {item_title}"))
        raise HTTPException(status_code=404, detail="Item not found")

@app.put("/items/{item_title}")
async def update_item(item_title: str, item: Item):
    updated_item = collection.find_one_and_update({"title": item_title}, {"$set": item.dict()})
    if updated_item is not None:
        logger.info(f"Updated item: {item_title}")
        # logger.info(format_log_message("INFO", f"Updated item: {item_title}"))
        return {"message": "Item has been updated successfully"}
    else:
        logger.warn(f"Attempted to update non-existent item: {item_title}")
        # logger.warn(format_log_message("WARN", f"Attempted to update non-existent item: {item_title}"))
        raise HTTPException(status_code=404, detail="Item not found")

@app.delete("/items/{item_title}")
async def delete_item(item_title: str):
    deleted_item = collection.find_one_and_delete({"title": item_title})
    if deleted_item is not None:
        logger.info(f"Deleted item: {item_title}")
        # logger.info(format_log_message("INFO", f"Deleted item: {item_title}"))
        return {"message": "Item has been deleted successfully"}
    else:
        logger.warn(f"Attempted to delete non-existent item: {item_title}")
        # logger.warn(format_log_message("WARN", f"Attempted to delete non-existent item: {item_title}"))
        raise HTTPException(status_code=404, detail="Item not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


