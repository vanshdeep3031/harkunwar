import React, { useState } from 'react';
import axios from 'axios';

function ProductCard({ product, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      setDeleting(true);
      await axios.delete(`/api/products/${product._id}`);
      onDelete();
    } catch (err) {
      alert('Failed to delete product');
      setDeleting(false);
    }
  };

  const categoryColors = {
    Electronics: 'primary', Sports: 'success', Kitchen: 'warning', Home: 'info'
  };
  const badgeColor = categoryColors[product.category] || 'secondary';

  return (
    <div className="card h-100 shadow-sm border-0">
      <img
        src={product.image || `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`}
        className="card-img-top"
        alt={product.name}
        style={{ height: '180px', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0 fw-bold">{product.name}</h5>
          <span className={`badge bg-${badgeColor}`}>{product.category}</span>
        </div>
        <p className="card-text text-muted flex-grow-1">{product.description}</p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fs-5 fw-bold text-success">${product.price.toFixed(2)}</span>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : '🗑️ Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
