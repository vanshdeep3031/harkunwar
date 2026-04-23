import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/products');
      setProducts(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    return () => {}; // cleanup
  }, []);

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-dark mb-4">
        <div className="container">
          <span className="navbar-brand fw-bold fs-4">🛍️ Product Store</span>
          <span className="text-white-50">Experiment 2.3.1 — React + Axios + Express</span>
        </div>
      </nav>

      <div className="container">
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Fetching products from API...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            <strong>Error:</strong> {error}
            <button type="button" className="btn-close" onClick={() => setError(null)} />
            <div className="mt-2">
              <button className="btn btn-outline-danger btn-sm" onClick={fetchProducts}>Retry</button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold mb-0">Products <span className="badge bg-secondary">{products.length}</span></h2>
              <button className="btn btn-outline-primary" onClick={fetchProducts}>🔄 Refresh</button>
            </div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 pb-5">
              {products.map(product => (
                <div className="col" key={product._id}>
                  <ProductCard product={product} onDelete={fetchProducts} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
