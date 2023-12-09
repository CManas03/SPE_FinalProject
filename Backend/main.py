from fastapi import FastAPI, HTTPException
from pymongo import MongoClient, errors
from pydantic import BaseModel
import json
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import time
import os


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

@app.on_event("startup")
async def startup_event():
    global client, db, collection
    attempts = 0
    while not client:
        try:
            client = MongoClient(uri, serverSelectionTimeoutMS=5000)
            # The ismaster command is cheap and does not require auth.
            client.admin.command('ismaster')
            db = client.projects
            collection = db.displayProjects
            print("Connected to MongoDB")
        except errors.ServerSelectionTimeoutError as err:
            # If connection attempt fails, wait and then try again.
            attempts += 1
            if attempts <= 5:  # Adjust the value as needed.
                print(f"Attempt #{attempts} to connect to MongoDB failed. Retrying in 5 seconds...")
                time.sleep(5)
            else:
                print("Could not connect to MongoDB after 5 attempts. Exiting...")
                raise err

    if collection.count_documents({}) == 0:  # Check if the collection is empty
        with open('projects.json') as f:
            data = json.load(f)
        
        for item in data:
            try:
                collection.insert_one(item)
            except errors.DuplicateKeyError:
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
    # Fetch data from MongoDB
    items = collection.find()
    data = [item_helper(item) for item in items]
    return {"items": data}

@app.post("/items/")
async def create_item(item: Item):
    # Insert a new item into the MongoDB collection
    try:
        collection.insert_one(item.dict())
        return {"message": "Item has been added successfully"}
    except errors.DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Duplicate item")

@app.get("/items/{item_title}")
async def read_item(item_title: str):
    # Fetch a specific item from the MongoDB collection
    item = collection.find_one({"title": item_title})
    if item is not None:
        return item_helper(item)
    else:
        raise HTTPException(status_code=404, detail="Item not found")

@app.put("/items/{item_title}")
async def update_item(item_title: str, item: Item):
    # Update a specific item in the MongoDB collection
    updated_item = collection.find_one_and_update({"title": item_title}, {"$set": item.dict()})
    if updated_item is not None:
        return {"message": "Item has been updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="Item not found")

@app.delete("/items/{item_title}")
async def delete_item(item_title: str):
    # Delete a specific item from the MongoDB collection
    deleted_item = collection.find_one_and_delete({"title": item_title})
    if deleted_item is not None:
        return {"message": "Item has been deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Item not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)