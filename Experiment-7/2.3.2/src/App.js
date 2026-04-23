import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCartCount } from './store/cartSlice';
import ProductList from './components/ProductList';
import CartView from './components/CartView';
import {
  AppBar, Toolbar, Typography, Badge, IconButton, Container, Tabs, Tab, Box
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';

const PRODUCTS = [
  { id: 1, name: 'Smartphone', price: 299.99, category: 'Electronics', description: 'Latest model with 5G', emoji: '📱' },
  { id: 2, name: 'Tablet', price: 449.99, category: 'Electronics', description: '10-inch display, 128GB', emoji: '📟' },
  { id: 3, name: 'Smartwatch', price: 199.99, category: 'Wearables', description: 'Health tracking & GPS', emoji: '⌚' },
  { id: 4, name: 'Laptop', price: 899.99, category: 'Computers', description: '16GB RAM, 512GB SSD', emoji: '💻' },
  { id: 5, name: 'Wireless Earbuds', price: 129.99, category: 'Audio', description: 'Noise cancellation', emoji: '🎧' },
  { id: 6, name: 'Keyboard', price: 79.99, category: 'Peripherals', description: 'Mechanical RGB keyboard', emoji: '⌨️' },
];

export default function App() {
  const [tab, setTab] = useState(0);
  const cartCount = useSelector(selectCartCount);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="sticky">
        <Toolbar>
          <StoreIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Redux Shopping Cart
          </Typography>
          <Typography variant="caption" sx={{ mr: 2, opacity: 0.8 }}>
            Experiment 2.3.2
          </Typography>
          <IconButton color="inherit" onClick={() => setTab(1)}>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="inherit" indicatorColor="secondary">
          <Tab label="🛍️ Products" />
          <Tab label={`🛒 Cart (${cartCount})`} />
        </Tabs>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {tab === 0 && <ProductList products={PRODUCTS} />}
        {tab === 1 && <CartView />}
      </Container>
    </Box>
  );
}
