import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_item():
    new_item = {
        "title": "New Item",
        "description": "New test item",
        "tldr": "New test item",
        "url": "hello.com",
        "techstack": "New test item"
    }
    response = client.post("/items/", json=new_item)
    assert response.status_code == 200  # Change status_code to the expected code
    assert response.json() == new_item  # Change to the expected response

def test_read_item():
    response = client.get("/items/Project 1")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)

def test_read_items():
    response = client.get("/items/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_item():
    updated_item = {
        "title": "Updated Test Item",
        "description": "This is an updated test item",
        "tldr": "This is an updated test item",
        "url": "hello.com",
        "techstack": "This is an updated test item"
    }
    response = client.put("/items/Updated Test Item", json=updated_item)
    assert response.status_code == 200
    assert response.json() == updated_item

def test_delete_item():
    response = client.delete("/items/Updated Test Item")
    assert response.status_code == 200
    assert response.json() == {"message": "Item has been deleted successfully"}



