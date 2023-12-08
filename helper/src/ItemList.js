import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getItems, deleteItem } from './apiService';
import './ItemList.css';

function ItemList() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        getItems().then(data => {
            setItems(data.data.items);
        });
    }, []);

    const handleDelete = (title) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            deleteItem(title).then(() => {
                setItems(items.filter(item => item.title !== title));
            });
        }
    };

    return (
<div>
    <div className="create-button-container">
        <Link to="/create" className="create-button">Create New Item</Link>
    </div>
    <div className="item-list">
        {items.map(item => (
            <div key={item.title} className="item-card">
                <h2>Title: {item.title}</h2>
                <p>TLDR: {item.tldr}</p>
                <p>Description: {item.description}</p>
                <p>Techstack: {item.techstack}</p>
                <p>URL: {item.url}</p>
                <button onClick={() => handleDelete(item.title)} className="delete-button">Delete</button>
                <Link to={`/edit/${item.title}`} className="edit-button">Edit</Link>
            </div>
        ))}
    </div>
</div>
    );
}

export default ItemList;