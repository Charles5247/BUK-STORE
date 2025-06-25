import { useState } from 'react';
import type { AlertColor } from '@mui/material';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  IconButton, 
  InputBase, 
  Paper,
  Chip,
  Rating,
  Divider,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Snackbar,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Import new components
import ShoppingCart from './ShoppingCart';
import AuthModal from './AuthModal';
import ProductModal from './ProductModal';

// University branding colors
const colors = {
  primary: '#1a365d', // Deep blue
  secondary: '#d69e2e', // Gold
  accent: '#38a169', // Green
  background: '#f7fafc',
  white: '#ffffff',
  text: '#2d3748'
};

// Placeholder categories with better icons
const categories = [
  { name: 'Laptops', icon: '💻', color: '#4299e1' },
  { name: 'Accessories', icon: '🎧', color: '#48bb78' },
  { name: 'Shoes', icon: '👟', color: '#ed8936' },
  { name: 'Clothes', icon: '👕', color: '#9f7aea' },
  { name: 'Music', icon: '🎵', color: '#f56565' },
  { name: 'Gifts', icon: '🎁', color: '#ed64a6' },
  { name: 'Others', icon: '🛒', color: '#718096' },
];

// Enhanced product data
const products = [
  { 
    id: 1, 
    name: 'Premium Biscuit Pack', 
    price: '₦1,000', 
    originalPrice: '₦1,500',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', 
    rating: 4.5,
    reviews: 128,
    vendor: 'Campus Store',
    discount: '33% OFF',
    category: 'Food',
    description: 'Delicious premium biscuits perfect for snacks. Made with high-quality ingredients.',
    inStock: true
  },
  { 
    id: 2, 
    name: 'Wireless Headphones', 
    price: '₦5,000', 
    originalPrice: '₦7,000',
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167', 
    rating: 4.7,
    reviews: 89,
    vendor: 'Tech Hub',
    discount: '29% OFF',
    category: 'Accessories',
    description: 'High-quality wireless headphones with noise cancellation and long battery life.',
    inStock: true
  },
  { 
    id: 3, 
    name: 'Sport Sneakers', 
    price: '₦8,000', 
    originalPrice: '₦12,000',
    image: 'https://images.unsplash.com/photo-1517260911205-8a3b5aee7a5d', 
    rating: 4.2,
    reviews: 156,
    vendor: 'Fashion Store',
    discount: '33% OFF',
    category: 'Shoes',
    description: 'Comfortable sport sneakers perfect for daily wear and exercise.',
    inStock: true
  },
  { 
    id: 4, 
    name: 'Smart Watch', 
    price: '₦15,000', 
    originalPrice: '₦20,000',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 
    rating: 4.8,
    reviews: 203,
    vendor: 'Tech Hub',
    discount: '25% OFF',
    category: 'Accessories',
    description: 'Feature-rich smartwatch with health tracking and notifications.',
    inStock: false
  },
  { 
    id: 5, 
    name: 'Backpack', 
    price: '₦3,500', 
    originalPrice: '₦5,000',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', 
    rating: 4.3,
    reviews: 67,
    vendor: 'Campus Store',
    discount: '30% OFF',
    category: 'Accessories',
    description: 'Durable backpack with multiple compartments for students.',
    inStock: true
  },
  { 
    id: 6, 
    name: 'Coffee Mug', 
    price: '₦800', 
    originalPrice: '₦1,200',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348', 
    rating: 4.6,
    reviews: 94,
    vendor: 'Campus Store',
    discount: '33% OFF',
    category: 'Others',
    description: 'Beautiful ceramic coffee mug perfect for your morning brew.',
    inStock: true
  },
];

const HomePage = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: AlertColor }>({ open: false, message: '', severity: 'success' });
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Filtered products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Cart functions
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showNotification('Product added to cart!', 'success');
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    showNotification('Product removed from cart!', 'info');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Authentication functions
  const handleAuth = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsLoggedIn(true);
      setUser({ name: 'John Doe', email: 'john@example.com' });
      setAuthModalOpen(false);
      showNotification('Successfully logged in!', 'success');
    }, 1000);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsLoggedIn(true);
      setUser({ name: 'New User', email: 'newuser@example.com' });
      setAuthModalOpen(false);
      showNotification('Account created successfully!', 'success');
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setUserMenuAnchor(null);
    showNotification('Logged out successfully!', 'info');
  };

  // Product functions
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  // Utility functions
  const showNotification = (message: string, severity: AlertColor = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: '100vh' }}>
      {/* Enhanced Header/NavBar */}
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: colors.white, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          color: colors.text
        }}
      >
        <Toolbar>
          <Typography 
            variant="h5" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              color: colors.primary,
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            Bayero E-Market
          </Typography>
          
          {/* Enhanced Search Bar */}
          <Paper
            component="form"
            sx={{ 
              p: '2px 4px', 
              display: 'flex', 
              alignItems: 'center', 
              width: 400, 
              mr: 3,
              borderRadius: '25px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <InputBase 
              sx={{ ml: 2, flex: 1, fontSize: '14px' }} 
              placeholder="Search for products, vendors..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              inputProps={{ 'aria-label': 'search products' }} 
            />
            <IconButton type="submit" sx={{ p: '10px', color: colors.primary }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
          
          <Button 
            sx={{ 
              color: colors.text, 
              mr: 1,
              '&:hover': { backgroundColor: colors.background }
            }}
          >
            Home
          </Button>
          <Button 
            sx={{ 
              color: colors.text, 
              mr: 1,
              '&:hover': { backgroundColor: colors.background }
            }}
          >
            Products
          </Button>
          <Button 
            sx={{ 
              color: colors.text, 
              mr: 2,
              '&:hover': { backgroundColor: colors.background }
            }}
          >
            FAQ
          </Button>
          
          {/* Shopping Cart Icon with Badge */}
          <IconButton 
            sx={{ color: colors.text, mr: 1 }}
            onClick={() => setCartOpen(true)}
          >
            <Badge badgeContent={getCartItemCount()} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* User Menu */}
          {isLoggedIn ? (
            <>
              <IconButton 
                sx={{ color: colors.text, mr: 2 }}
                onClick={(e) => setUserMenuAnchor(e.currentTarget)}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: colors.primary }}>
                  {user?.name?.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={() => setUserMenuAnchor(null)}
              >
                <MenuItem onClick={() => setUserMenuAnchor(null)}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => setUserMenuAnchor(null)}>
                  Orders
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              variant="outlined"
              sx={{ 
                color: colors.primary,
                borderColor: colors.primary,
                mr: 2,
                '&:hover': { 
                  backgroundColor: colors.primary,
                  color: colors.white
                }
              }}
              onClick={() => handleAuth('login')}
            >
              Login
            </Button>
          )}
          
          <Button 
            variant="contained" 
            sx={{ 
              backgroundColor: colors.primary,
              '&:hover': { backgroundColor: '#0f2a4a' },
              borderRadius: '20px',
              px: 3
            }}
          >
            Go Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ 
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        color: colors.white,
        py: 6,
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, fontFamily: 'Poppins, sans-serif' }}>
            Welcome to Bayero University E-Market
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
            Discover amazing products from your university community
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              backgroundColor: colors.white,
              color: colors.primary,
              '&:hover': { backgroundColor: '#f0f0f0' },
              borderRadius: '25px',
              px: 4,
              py: 1.5
            }}
          >
            Start Shopping
          </Button>
        </Container>
      </Box>

      {/* Enhanced Category Navigation */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.text, mr: 2 }}>
            Shop by Category
          </Typography>
          <Chip 
            label={selectedCategory}
            sx={{ 
              backgroundColor: colors.accent, 
              color: colors.white,
              fontWeight: 'bold'
            }} 
          />
        </Box>
        <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, pb: 2 }}>
          <Card 
            sx={{ 
              minWidth: 100, 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: selectedCategory === 'All' ? colors.primary : colors.white,
              color: selectedCategory === 'All' ? colors.white : colors.text,
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}
            onClick={() => setSelectedCategory('All')}
          >
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ mb: 1 }}>🛍️</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                All
              </Typography>
            </CardContent>
          </Card>
          {categories.map((cat) => (
            <Card 
              key={cat.name} 
              sx={{ 
                minWidth: 120, 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: selectedCategory === cat.name ? colors.primary : colors.white,
                color: selectedCategory === cat.name ? colors.white : colors.text,
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ mb: 1 }}>{cat.icon}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {cat.name}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Enhanced Best Deals Section */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.text, mr: 2 }}>
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Best Deals'}
          </Typography>
          <Chip 
            label={`${filteredProducts.length} products`}
            sx={{ 
              backgroundColor: colors.accent, 
              color: colors.white,
              fontWeight: 'bold'
            }} 
          />
        </Box>
        
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': { 
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                  }
                }}
                onClick={() => openProductModal(product)}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Chip 
                    label={product.discount}
                    sx={{ 
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: colors.accent,
                      color: colors.white,
                      fontWeight: 'bold'
                    }}
                  />
                  {!product.inStock && (
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Chip 
                        label="Out of Stock"
                        sx={{ 
                          backgroundColor: '#f56565',
                          color: colors.white,
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  )}
                </Box>
                
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: colors.text }}>
                    {product.name}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    by {product.vendor}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={product.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" sx={{ ml: 1, color: '#666' }}>
                      ({product.reviews})
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.primary }}>
                      {product.price}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        ml: 1, 
                        textDecoration: 'line-through', 
                        color: '#999' 
                      }}
                    >
                      {product.originalPrice}
                    </Typography>
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    fullWidth
                    disabled={!product.inStock}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    sx={{ 
                      backgroundColor: colors.primary,
                      '&:hover': { backgroundColor: '#0f2a4a' },
                      borderRadius: '20px',
                      py: 1
                    }}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
              No products found
            </Typography>
            <Typography variant="body2" sx={{ color: '#999' }}>
              Try adjusting your search or category filter
            </Typography>
          </Box>
        )}
      </Container>

      {/* Enhanced Footer */}
      <Box sx={{ 
        backgroundColor: colors.primary, 
        color: colors.white,
        py: 4,
        mt: 'auto'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Bayero University E-Market
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Connecting the university community through seamless buying and selling.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Quick Links
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                About Us
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                Contact Support
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Privacy Policy
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Contact Info
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                Bayero University, Kano
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                support@bukmarket.com
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                +234 123 456 7890
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
          <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.8 }}>
            &copy; {new Date().getFullYear()} Bayero University E-Market. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* Shopping Cart Component */}
      <ShoppingCart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />

      {/* Authentication Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
        onLogin={handleLogin}
        onRegister={handleRegister}
        loading={false}
      />

      {/* Product Details Modal */}
      <ProductModal
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        product={selectedProduct}
        onAddToCart={addToCart}
      />

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={closeNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage; 