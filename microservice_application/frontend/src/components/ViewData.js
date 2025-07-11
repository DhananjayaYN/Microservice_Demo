import React from 'react';
import '../styles/ViewData.css';

const ViewData = () => {
  // Sample data for demonstration; in a real app, this would come from an API
  const data = [
    { id: 1, name: 'Product 1', price: 25.00, stock: 100 },
    { id: 2, name: 'Product 2', price: 35.00, stock: 50 },
    { id: 3, name: 'Product 3', price: 15.00, stock: 200 }
  ];

  return (
    <div className="viewdata-container">
      <h2>View Data</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => window.location.href = '/signin'}>Logout</button>
    </div>
  );
};

export default ViewData;
