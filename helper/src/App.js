import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ItemList from './ItemList';
import ItemForm from './ItemForm';

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<ItemList />} />
              <Route path="/create" element={<ItemForm />} />
              <Route path="/edit/:title" element={<ItemForm />} />
          </Routes>
      </Router>
  );
}

export default App;