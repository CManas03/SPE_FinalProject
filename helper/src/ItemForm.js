import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getItem, createItem, updateItem } from './apiService';
import './ItemForm.css';

function ItemForm() {
    const { title } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState({
        title: '',
        description: '',
        tldr: '',
        url: '',
        techstack:''
    });


    useEffect(() => {
        if (title) {
            getItem(title).then((item) => {
                setItem(item);
                console.log(item);
            });
        }
    }, [title]);

    const handleChange = (event) => {
        setItem({
            ...item,
            [event.target.name]: event.target.value
        });
    };

    function handleSubmit(event) {
        event.preventDefault();
        const trimmedItem = {
            title: item.title.trim(),
            description: item.description.trim(),
            tldr: item.tldr.trim(),
            url: item.url.trim(),
            techstack: item.techstack.trim()
        };
        if (!trimmedItem.title || !trimmedItem.description || !trimmedItem.tldr || !trimmedItem.url || !trimmedItem.techstack) {
            return;
        }
        if (title) {
            updateItem(title, trimmedItem).then(() => navigate('/'));
        } else {
            createItem(trimmedItem).then(() => navigate('/'));
        }
    }

    return (
        <form onSubmit={handleSubmit} className="item-form">
            <div className="form-group">
                <label>Title</label>
                <input name="title" onChange={handleChange} placeholder="Title" required className="form-input" />
            </div>
            <div className="form-group">
                <label>TL;DR</label>
                <textarea name="tldr" onChange={handleChange} placeholder="TL;DR" required className="form-input" />
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea name="description" onChange={handleChange} placeholder="Description" required className="form-input" />
            </div>
            <div className="form-group"> 
                <label>Tech Stack</label>
                <input name="techstack" onChange={handleChange} placeholder="Tech Stack" required className="form-input" />
            </div>
            <div className="form-group">
                <label>URL</label>
                <input name="url" onChange={handleChange} placeholder="URL" required className="form-input" />
            </div>
            <button type="submit" className="submit-button">Submit</button>
        </form>
    );
}

export default ItemForm;