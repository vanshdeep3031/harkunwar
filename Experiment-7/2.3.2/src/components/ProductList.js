import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartItems } from '../store/cartSlice';
import {
  Grid, Card, CardContent, Typography, Button, Chip, Box, Snackbar, Alert
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useState } from 'react';

export default function ProductList({ products }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const [snack, setSnack] = useState('');

  const getCartQty = (id) => cartItems.find(i => i.id === id)?.quantity || 0;

  const handleAdd = (product) => {
    dispatch(addToCart(product));
    setSnack(`${product.emoji} ${product.name} added to cart!`);
  };

  return (
    <>
      <Typography variant="h5" fontWeight="bold" mb={3}>Available Products</Typography>
      <Grid container spacing={3}>
        {products.map(product => {
          const qty = getCartQty(product.id);
          return (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column',
                transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', elevation: 8 } }}>
                <Box sx={{ fontSize: '4rem', textAlign: 'center', py: 3, bgcolor: '#f0f4ff' }}>
                  {product.emoji}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Typography variant="h6" fontWeight="bold">{product.name}</Typography>
                    <Chip label={product.category} size="small" color="primary" variant="outlined" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>{product.description}</Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" color="success.main" fontWeight="bold">
                      ${product.price.toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() => handleAdd(product)}
                    >
                      {qty > 0 ? `Add (${qty})` : 'Add'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled">{snack}</Alert>
      </Snackbar>
    </>
  );
}
