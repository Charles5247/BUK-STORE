import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
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
  Badge,
  Snackbar,
  Alert,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Carousel from 'react-material-ui-carousel';
import type { AlertColor } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Link as RouterLink } from 'react-router-dom';
import { UserContext } from './UserContext';
import Logo from '../images/img_logo.png';
import '../i18n';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme';
import i18n from '../i18n';

// Import components
import ShoppingCart from './ShoppingCart';
import AuthModal from './AuthModal';
import ProductModal from './ProductModal';

// Import hooks
import { useProducts } from '../hooks/useProducts';
import { useVendors } from '../hooks/useVendors';
import { useGeolocation } from '../hooks/useGeolocation';

// Import commerce functions
import { loginUser, registerUser } from '../lib/commerce';

// Carousel images for hero
const heroImages = [
  { url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2', label: 'Skin Care' },
  { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', label: 'Tech' },
  { url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528', label: 'Health' },
  { url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', label: 'Household' },
  { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', label: 'Food' },
  { url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f', label: 'Clothes' },
  { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9', label: 'Accessories' },
];

// Add demo customer reviews
const customerReviews = [
  {
    id: 1,
    name: 'Aisha Bello',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    review: 'The Vitamin C Serum really brightened my skin! Fast delivery too.',
    product: 'Vitamin C Serum',
  },
  {
    id: 2,
    name: 'Musa Abdullahi',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    review: 'Wireless Earbuds are great for lectures. Battery lasts all day.',
    product: 'Wireless Earbuds',
  },
  {
    id: 3,
    name: 'Fatima Sani',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    review: 'Loved the Ankara Dress! Got so many compliments.',
    product: 'Ankara Dress',
  },
  {
    id: 4,
    name: 'Ibrahim Garba',
    image: 'https://randomuser.me/api/portraits/men/33.jpg',
    review: 'Jollof Rice from Campus Bites is always fresh and tasty.',
    product: 'Jollof Rice',
  },
];

// Restore static categories array
const categories = [
  { name: 'All', icon: '🛍️' },
  { name: 'Laptops', icon: '💻' },
  { name: 'Accessories', icon: '🎧' },
  { name: 'Shoes', icon: '👟' },
  { name: 'Clothes', icon: '👕' },
  { name: 'Music', icon: '🎵' },
  { name: 'Gifts', icon: '🎁' },
];

// Helper to convert country code to emoji flag
function countryCodeToFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

const HomePageNew = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: AlertColor }>({ open: false, message: '', severity: 'success' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState<'customer' | 'vendor' | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([{ from: 'ai', text: 'Hi! How can I help you today?' }]);
  const [logoError, setLogoError] = useState(false);

  // Hooks
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { vendors, loading: vendorsLoading, error: vendorsError } = useVendors();
  const { location, loading: geoLoading, error: geoError } = useGeolocation();
  const { t } = useTranslation();

  // Location-based filtering
  const isOnCampus = location && location.city === 'Kano' && location.country === 'Nigeria';
  const filteredVendors = !location || isOnCampus
    ? vendors
    : vendors.filter(v => v.location && (v.location.includes(location.city) || v.location.includes(location.country)));
  const filteredProducts = !location || isOnCampus
    ? products
    : products.filter(p => {
        const vendor = filteredVendors.find(v => v.id === p.vendorId);
        return vendor;
      });

  // Defensive filtering for product groupings
  const filteredBestForYou = selectedCategory === 'All'
    ? filteredProducts.filter(p => p.rating && p.inStock)
    : filteredProducts.filter(p => p.category === selectedCategory && p.rating && p.inStock);
  const filteredRecommended = selectedCategory === 'All'
    ? filteredProducts.filter(p => p.category && (p.category === 'Tech' || p.category === 'Skin Care'))
    : filteredProducts.filter(p => p.category === selectedCategory && (p.category === 'Tech' || p.category === 'Skin Care'));
  const filteredTopDeals = selectedCategory === 'All'
    ? filteredProducts.filter(p => p.discount && parseInt(p.discount) >= 25)
    : filteredProducts.filter(p => p.category === selectedCategory && p.discount && parseInt(p.discount) >= 25);

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

  // Updated Auth functions
  const handleLogin = async (userData) => {
    console.log('Login attempt:', userData);
    try {
      const response = await loginUser(userData.email, userData.password);
      if (response.success) {
        setIsLoggedIn(true);
        setUserType(response.user.type);
        setUser(response.user);
        setAuthModalOpen(false);
        showNotification(`Successfully logged in as ${response.user.type}!`, 'success');
      } else {
        showNotification('Login failed. Please check your credentials.', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showNotification(error.message || 'Login failed. Please try again.', 'error');
    }
  };

  const handleRegister = async (userData) => {
    console.log('Registration attempt:', userData);
    try {
      const response = await registerUser(userData);
      if (response.success) {
        setIsLoggedIn(true);
        setUserType(response.user.type);
        setUser(response.user);
        setAuthModalOpen(false);
        showNotification(`${response.user.type} account created successfully!`, 'success');
      } else {
        showNotification('Registration failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showNotification(error.message || 'Registration failed. Please try again.', 'error');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setUserType(null);
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

  // Helper to get vendor info by vendorId
  const getVendor = (vendorId: number) => vendors.find(v => v.id === vendorId);

  const handleChatSend = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { from: 'user', text: chatInput }]);
      setChatInput('');
      setTimeout(() => setChatMessages(msgs => [...msgs, { from: 'ai', text: 'This is a demo AI response.' }]), 1000);
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <UserContext.Provider value={{ user, setUser, userType, setUserType }}>
      <Box sx={{ backgroundColor: colors.background, minHeight: '100vh' }}>
        {/* Header */}
        <AppBar 
          position="static" 
          sx={{ 
            backgroundColor: colors.white, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            color: colors.text
          }}
        >
          <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, minHeight: 72 }}>
            {/* Left: Logo + App Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 220 }}>
              {!logoError ? (
                <img 
                  src={Logo} 
                  alt={t('Welcome to Last-Stop Stores')} 
                  style={{ height: 56, marginRight: 16 }} 
                  onError={() => setLogoError(true)}
                />
              ) : (
                <Typography 
                  variant="h5" 
                  sx={{ fontWeight: 'bold', color: colors.primary, whiteSpace: 'nowrap', marginRight: 2 }}
                >
                  {t('Welcome to Last-Stop Stores')}
                </Typography>
              )}
              {/* Show geolocation info if available */}
              {location && !geoLoading && !geoError && (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <span style={{ fontSize: 24, marginRight: 4 }}>
                    {countryCodeToFlagEmoji(location.countryCode)}
                  </span>
                  <Typography variant="body2" sx={{ color: colors.primary }}>
                    {location.city}, {location.country}
                  </Typography>
                </Box>
              )}
              {/* Language Switcher */}
              <select
                style={{ marginLeft: 12, padding: '4px 8px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14 }}
                value={i18n.language}
                onChange={e => i18n.changeLanguage(e.target.value)}
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="ha">Hausa</option>
                <option value="ar">العربية</option>
              </select>
            </Box>
            {/* Center: Search Bar */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <Paper
                component="form"
                sx={{ 
                  p: '2px 4px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: { xs: 180, sm: 300, md: 400 }, 
                  mr: 3,
                  borderRadius: '25px',
                  boxShadow: 'none',
                  background: '#f7fafc',
                }}
              >
                <InputBase 
                  sx={{ ml: 2, flex: 1 }} 
                  placeholder={t('Search products...')} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton type="submit" sx={{ p: '10px', color: colors.primary }}>
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Box>
            {/* Right: Cart, Login, FAQ Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                sx={{ color: colors.text, mr: 1 }}
                onClick={() => setCartOpen(true)}
              >
                <Badge badgeContent={getCartItemCount()} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              {isLoggedIn ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip 
                    label={userType === 'customer' ? 'Customer' : 'Vendor'}
                    color="primary"
                    size="small"
                  />
                  <Typography variant="body2" sx={{ color: colors.text }}>
                    {user?.name}
                  </Typography>
                  <Button 
                    variant="outlined"
                    size="small"
                    onClick={handleLogout}
                    sx={{ 
                      color: colors.primary,
                      borderColor: colors.primary
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              ) : (
                <Button 
                  variant="outlined"
                  sx={{ 
                    color: colors.primary,
                    borderColor: colors.primary,
                    mr: 2
                  }}
                  onClick={() => setAuthModalOpen(true)}
                >
                  {t('Login')}
                </Button>
              )}
              <Button
                component={RouterLink}
                to="/faq"
                sx={{ 
                  color: colors.text, 
                  mr: 1,
                  '&:hover': { backgroundColor: colors.background }
                }}
              >
                {t('FAQ')}
              </Button>
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: colors.primary,
                  borderRadius: '20px',
                  ml: 1
                }}
                onClick={() => {
                  if (isLoggedIn) {
                    if (userType === 'vendor') {
                      window.location.href = '/vendor';
                    } else {
                      window.location.href = '/customer';
                    }
                  } else {
                    setAuthModalOpen(true);
                  }
                }}
              >
                {isLoggedIn 
                  ? (userType === 'vendor' ? t('Vendor Dashboard') : t('My Account'))
                  : t('Get Started')
                }
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Hero Section with Carousel Background */}
        <Box sx={{ position: 'relative', minHeight: 400, mb: 6 }}>
          <Carousel
            indicators={false}
            navButtonsAlwaysInvisible
            interval={4000}
            animation="fade"
            sx={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }}
          >
            {heroImages.map((img, idx) => (
              <Box
                key={idx}
                sx={{
                  width: '100%',
                  height: 400,
                  backgroundImage: `url(${img.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.6)'
                }}
              />
            ))}
          </Carousel>
          <Box sx={{ position: 'relative', zIndex: 2, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff', textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              {t('Welcome to Last-Stop Stores')}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, mb: 4, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              Discover amazing products from your university community
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                backgroundColor: colors.white,
                color: colors.primary,
                borderRadius: '25px',
                px: 4,
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              Start Shopping
            </Button>
          </Box>
        </Box>

        {/* Category Navigation Bar (centered) */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <Button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                variant={selectedCategory === cat.name ? 'contained' : 'outlined'}
                sx={{
                  minWidth: 120,
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  color: selectedCategory === cat.name ? colors.white : colors.primary,
                  backgroundColor: selectedCategory === cat.name ? colors.primary : colors.white,
                  borderColor: colors.primary,
                  boxShadow: selectedCategory === cat.name ? '0 2px 8px rgba(26,54,93,0.15)' : 'none',
                  '&:hover': {
                    backgroundColor: selectedCategory === cat.name ? '#0f2a4a' : '#f0f0f0',
                    color: colors.primary,
                  },
                  px: 3,
                  py: 1.5,
                }}
              >
                <span style={{ marginRight: 8 }}>{cat.icon}</span>
                {cat.name}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Product Groupings */}
        <Grid container spacing={3} sx={{ mt: 0 }}>
          {/* Left Sidebar: Top Vendors */}
          <Grid item xs={0} md={2} lg={2} xl={2} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: colors.primary }}>Top Rated Vendors</Typography>
              {filteredVendors.length === 0 && !isOnCampus && (
                <Typography variant="body2" color="warning.main" sx={{ mb: 2 }}>
                  No vendors available for your location. Showing only campus vendors.
                </Typography>
              )}
              {filteredVendors.sort((a, b) => b.rating - a.rating).slice(0, 4).map(vendor => (
                <Card key={vendor.id} sx={{ mb: 2, p: 2, display: 'flex', alignItems: 'center', boxShadow: 1 }}>
                  <Avatar src={vendor.logo} alt={vendor.name} sx={{ width: 48, height: 48, mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{vendor.name}</Typography>
                    <Typography variant="body2" color="textSecondary">{vendor.category}</Typography>
                    <Rating value={vendor.rating} precision={0.1} readOnly size="small" />
                  </Box>
                </Card>
              ))}
            </Box>
          </Grid>
          {/* Center: Main Content */}
          <Grid item xs={12} md={8} lg={8} xl={8}>
            {/* Product Groupings */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: colors.primary }}>Best for You</Typography>
              {filteredBestForYou.length === 0 && !isOnCampus && (
                <Typography variant="body2" color="warning.main" sx={{ mb: 2 }}>
                  No products available for your location. Showing only campus products.
                </Typography>
              )}
              <Grid container spacing={2}>
                {filteredBestForYou.map(product => {
                  const vendor = getVendor(product.vendorId);
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={2} xl={2} key={product.id}>
                      <Card
                        onClick={() => openProductModal(product)}
                        sx={{
                          cursor: 'pointer',
                          transition: 'transform 0.15s, box-shadow 0.15s',
                          '&:hover': {
                            transform: 'translateY(-6px) scale(1.03)',
                            boxShadow: '0 6px 24px rgba(26,54,93,0.15)',
                          },
                        }}
                      >
                        <CardMedia component="img" height="180" image={product.image} alt={product.name} />
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{product.name}</Typography>
                          <Typography variant="body2" color="textSecondary">{product.category}</Typography>
                          <Typography variant="body2" color="textSecondary">By {vendor?.name} ({vendor?.location})</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={product.rating} precision={0.1} size="small" readOnly />
                            <Typography variant="body2" sx={{ ml: 1, color: '#666' }}>({product.reviews})</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.primary }}>{product.price}</Typography>
                            <Typography variant="body2" sx={{ ml: 1, textDecoration: 'line-through', color: '#999' }}>{product.originalPrice}</Typography>
                            <Chip label={product.discount} size="small" sx={{ ml: 2, backgroundColor: colors.accent, color: '#fff' }} />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: colors.primary }}>Recommended</Typography>
              <Grid container spacing={2}>
                {filteredRecommended.map(product => {
                  const vendor = getVendor(product.vendorId);
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={2} xl={2} key={product.id}>
                      <Card
                        onClick={() => openProductModal(product)}
                        sx={{
                          cursor: 'pointer',
                          transition: 'transform 0.15s, box-shadow 0.15s',
                          '&:hover': {
                            transform: 'translateY(-6px) scale(1.03)',
                            boxShadow: '0 6px 24px rgba(26,54,93,0.15)',
                          },
                        }}
                      >
                        <CardMedia component="img" height="180" image={product.image} alt={product.name} />
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{product.name}</Typography>
                          <Typography variant="body2" color="textSecondary">{product.category}</Typography>
                          <Typography variant="body2" color="textSecondary">By {vendor?.name} ({vendor?.location})</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={product.rating} precision={0.1} size="small" readOnly />
                            <Typography variant="body2" sx={{ ml: 1, color: '#666' }}>({product.reviews})</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.primary }}>{product.price}</Typography>
                            <Typography variant="body2" sx={{ ml: 1, textDecoration: 'line-through', color: '#999' }}>{product.originalPrice}</Typography>
                            <Chip label={product.discount} size="small" sx={{ ml: 2, backgroundColor: colors.accent, color: '#fff' }} />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: colors.primary }}>Top Deals</Typography>
              <Grid container spacing={2}>
                {filteredTopDeals.map(product => {
                  const vendor = getVendor(product.vendorId);
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={2} xl={2} key={product.id}>
                      <Card
                        onClick={() => openProductModal(product)}
                        sx={{
                          cursor: 'pointer',
                          transition: 'transform 0.15s, box-shadow 0.15s',
                          '&:hover': {
                            transform: 'translateY(-6px) scale(1.03)',
                            boxShadow: '0 6px 24px rgba(26,54,93,0.15)',
                          },
                        }}
                      >
                        <CardMedia component="img" height="180" image={product.image} alt={product.name} />
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{product.name}</Typography>
                          <Typography variant="body2" color="textSecondary">{product.category}</Typography>
                          <Typography variant="body2" color="textSecondary">By {vendor?.name} ({vendor?.location})</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={product.rating} precision={0.1} size="small" readOnly />
                            <Typography variant="body2" sx={{ ml: 1, color: '#666' }}>({product.reviews})</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.primary }}>{product.price}</Typography>
                            <Typography variant="body2" sx={{ ml: 1, textDecoration: 'line-through', color: '#999' }}>{product.originalPrice}</Typography>
                            <Chip label={product.discount} size="small" sx={{ ml: 2, backgroundColor: colors.accent, color: '#fff' }} />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Grid>
          {/* Right Sidebar: Customer Reviews */}
          <Grid item xs={0} md={2} lg={2} xl={2} sx={{ display: { xs: 'none', md: 'block' }, minWidth: 260, maxWidth: 320, position: 'sticky', top: 100 }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: colors.primary }}>Customer Reviews</Typography>
              {customerReviews.map(review => (
                <Card key={review.id} sx={{ mb: 2, p: 2, display: 'flex', alignItems: 'flex-start', boxShadow: 1 }}>
                  <Avatar src={review.image} alt={review.name} sx={{ width: 40, height: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{review.name}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>{review.product}</Typography>
                    <Typography variant="body2">"{review.review}"</Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Floating Chat Assistant Button */}
        <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          <IconButton color="primary" size="large" onClick={handleBackToTop} sx={{ backgroundColor: '#fff', boxShadow: 2 }}>
            <ArrowUpwardIcon />
          </IconButton>
          <IconButton color="primary" size="large" onClick={() => setChatOpen(true)} sx={{ backgroundColor: '#fff', boxShadow: 2 }}>
            <ChatIcon />
          </IconButton>
        </Box>

        {/* Chat Assistant Modal */}
        <Dialog open={chatOpen} onClose={() => setChatOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>AI Assistant</DialogTitle>
          <DialogContent dividers sx={{ minHeight: 200 }}>
            {chatMessages.map((msg, idx) => (
              <Box key={idx} sx={{ mb: 1, textAlign: msg.from === 'ai' ? 'left' : 'right' }}>
                <Typography variant="body2" sx={{ color: msg.from === 'ai' ? 'primary.main' : 'secondary.main' }}>{msg.text}</Typography>
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <TextField
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleChatSend(); }}
              placeholder="Type your message..."
              fullWidth
              size="small"
            />
            <Button onClick={handleChatSend} variant="contained">Send</Button>
          </DialogActions>
        </Dialog>

        {/* Footer */}
        <Box sx={{ 
          backgroundColor: colors.primary, 
          color: colors.white,
          py: 4,
          textAlign: 'center'
        }}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} Last-Stop Stores. All rights reserved.
          </Typography>
        </Box>

        {/* Components */}
        <ShoppingCart
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
        />

        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          mode={authMode}
          onModeChange={setAuthMode}
          onLogin={handleLogin}
          onRegister={handleRegister}
          loading={false}
        />

        <ProductModal
          open={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          product={selectedProduct}
          onAddToCart={addToCart}
          vendor={selectedProduct ? getVendor(selectedProduct.vendorId) : undefined}
        />

        {/* Notifications */}
        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={closeNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={closeNotification} severity={notification.severity}>
            {notification.message}
          </Alert>
        </Snackbar>

        {/* Error/Loading UI for products/vendors */}
        {productsLoading && <Typography align="center">Loading products...</Typography>}
        {productsError && <Typography color="error" align="center">Failed to load products.</Typography>}
        {vendorsLoading && <Typography align="center">Loading vendors...</Typography>}
        {vendorsError && <Typography color="error" align="center">Failed to load vendors.</Typography>}
      </Box>
    </UserContext.Provider>
  );
};

export default HomePageNew; 