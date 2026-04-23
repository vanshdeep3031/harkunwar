import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCart, updateQuantity, clearCart,
  selectCartItems, selectCartTotal
} from '../store/cartSlice';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Button, IconButton, TextField, Box, Divider, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';

export default function CartView() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h1" mb={2}>🛒</Typography>
        <Typography variant="h5" color="text.secondary">Your cart is empty</Typography>
        <Typography color="text.secondary" mt={1}>Switch to Products tab to add items</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Your Cart</Typography>
        <Button
          variant="outlined" color="error" startIcon={<ClearAllIcon />}
          onClick={() => dispatch(clearCart())}
        >
          Clear All
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Price</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Quantity</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Subtotal</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
                    <Typography fontWeight="medium">{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={e => dispatch(updateQuantity({ id: item.id, quantity: parseInt(e.target.value) || 0 }))}
                    inputProps={{ min: 0, style: { textAlign: 'center' } }}
                    size="small"
                    sx={{ width: 80 }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => dispatch(removeFromCart(item.id))}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper elevation={2} sx={{ mt: 3, p: 3 }}>
        <Divider sx={{ mb: 2 }} />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">Total</Typography>
          <Typography variant="h4" color="success.main" fontWeight="bold">${total.toFixed(2)}</Typography>
        </Box>
        <Button variant="contained" color="success" fullWidth size="large" sx={{ mt: 2 }}>
          Proceed to Checkout
        </Button>
        <Alert severity="info" sx={{ mt: 2 }}>
          Cart is persisted to localStorage — refresh the page to verify!
        </Alert>
      </Paper>
    </>
  );
}
