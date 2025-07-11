import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../config/api';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await apiRequest('http://localhost:4000/api/products');
        
        if (!Array.isArray(response)) {
          throw new Error('Invalid data format received from server');
        }
        
        setProducts(response);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = (e, productId) => {
    e.stopPropagation();
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', productId);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  const renderAuthButtons = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (isAuthenticated) {
      return (
        <div className="auth-links">
          <Link to="/dashboard" className="btn btn-dashboard">Dashboard</Link>
          <button 
            onClick={() => {
              localStorage.removeItem('isAuthenticated');
              localStorage.removeItem('user');
              window.location.href = '/';
            }} 
            className="btn btn-logout"
          >
            Logout
          </button>
        </div>
      );
    }
    
    return (
      <div className="auth-links">
        <Link to="/login" className="btn btn-login">Sign In</Link>
        <Link to="/signup" className="btn btn-signup">Sign Up</Link>
      </div>
    );
  };

  return (
    <div className="products-container">
      <header className="products-header">
        <h1>Our Products</h1>
        {renderAuthButtons()}
      </header>
      
      <main className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="product-image">
                <div className="product-category">{product.category}</div>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} />
                ) : (
                  <div className="product-image-placeholder">
                    <span>No Image Available</span>
                  </div>
                )}
              </div>
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">
                  {product.description || 'No description available'}
                </p>
                <div className="product-footer">
                  <span className="product-price">
                    Rs. {parseFloat(product.price).toLocaleString('en-IN')}
                  </span>
                  <span className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </span>
                </div>
                <div className="product-actions">
                  <button 
                    className="add-to-cart-btn"
                    onClick={(e) => handleAddToCart(e, product.id)}
                    disabled={product.stock <= 0}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <button 
                    className="view-details-btn"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>No products available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
