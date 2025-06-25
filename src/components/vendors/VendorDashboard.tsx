import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, AppBar, Toolbar, Card, Grid, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useState, useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import { getVendorStats, getVendorProducts, getVendorOrders, updateVendorProfile } from '../../lib/commerce';

const drawerWidth = 220;

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon /> },
  { label: 'Products', icon: <ListAltIcon /> },
  { label: 'Orders', icon: <ShoppingCartIcon /> },
  { label: 'Analytics', icon: <BarChartIcon /> },
  { label: 'Help', icon: <HelpOutlineIcon /> },
  { label: 'Logout', icon: <LogoutIcon /> },
];

function useVendorStats(userId) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!userId) return;
    getVendorStats(userId)
      .then(setStats)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  return { stats, loading, error };
}

function useVendorProducts(userId) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!userId) return;
    getVendorProducts(userId)
      .then(setProducts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  return { products, loading, error };
}

function useVendorOrders(userId) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!userId) return;
    getVendorOrders(userId)
      .then(setOrders)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  return { orders, loading, error };
}

const VendorDashboard = () => {
  const { user, setUser } = useUser();
  const userId = user?.id;
  const profileData = user && user.type === 'vendor' ? user : { 
    logo: '', 
    businessName: '', 
    email: '', 
    phone: '', 
    businessType: '', 
    city: '',
    country: ''
  };
  const { stats } = useVendorStats(userId);
  const { products } = useVendorProducts(userId);
  const { orders } = useVendorOrders(userId);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(profileData);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const handleEditOpen = () => {
    setEditData(profileData);
    setEditOpen(true);
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData(prev => ({ ...prev, logo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('businessName', editData.businessName);
      formData.append('businessType', editData.businessType);
      formData.append('email', editData.email);
      formData.append('phone', editData.phone);
      formData.append('city', editData.city);
      formData.append('country', editData.country);
      
      if (profileImage) {
        formData.append('logo', profileImage);
      }

      // Make API call to update profile
      const updatedProfile = await updateVendorProfile(userId, formData);
      
      // Update user context with new data
      setUser(updatedProfile);
      setEditOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f7fafc' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #38a169 80%, #1a365d 100%)',
            color: '#fff',
          },
        }}
      >
        <Toolbar sx={{ minHeight: 80 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
            VENDOR DASHBOARD
          </Typography>
        </Toolbar>
        <Divider sx={{ background: 'rgba(255,255,255,0.2)' }} />
        <List>
          {navItems.map(item => (
            <ListItem button key={item.label} sx={{ my: 1, borderRadius: 2, '&:hover': { background: 'rgba(255,255,255,0.08)' } }}>
              <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, ml: `${drawerWidth}px` }}>
        <AppBar position="static" elevation={0} sx={{ background: 'transparent', boxShadow: 'none', mb: 4 }}>
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <Avatar src={profileData.logo || ''} sx={{ bgcolor: '#38a169', mr: 2 }} />
            <Typography variant="subtitle1" sx={{ color: '#1a365d', fontWeight: 'bold' }}>{profileData.businessName || ''}</Typography>
          </Toolbar>
        </AppBar>
        <Card sx={{ p: 3, mb: 4, display: 'flex', alignItems: 'center', boxShadow: 2, borderRadius: 3 }}>
          <Avatar src={profileData.logo || ''} sx={{ width: 64, height: 64, mr: 3 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a365d' }}>{profileData.businessName || ''}</Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>{profileData.email || ''}</Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>Phone: {profileData.phone || ''}</Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>Business Type: {profileData.businessType || ''}</Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>Location: {profileData.city || ''}, {profileData.country || ''}</Typography>
          </Box>
          <Button variant="outlined" onClick={handleEditOpen} sx={{ ml: 2 }}>Edit Profile</Button>
        </Card>
        
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            {/* Profile Photo Upload */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                src={editData.logo || ''} 
                sx={{ width: 100, height: 100, mb: 2 }}
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-image-upload"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="profile-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCameraIcon />}
                >
                  Upload Logo
                </Button>
              </label>
            </Box>

            <TextField
              margin="dense"
              label="Business Name"
              fullWidth
              value={editData.businessName || ''}
              onChange={e => handleEditChange('businessName', e.target.value)}
            />
            <TextField
              margin="dense"
              label="Business Type"
              fullWidth
              value={editData.businessType || ''}
              onChange={e => handleEditChange('businessType', e.target.value)}
            />
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              value={editData.email || ''}
              onChange={e => handleEditChange('email', e.target.value)}
            />
            <TextField
              margin="dense"
              label="Phone"
              fullWidth
              value={editData.phone || ''}
              onChange={e => handleEditChange('phone', e.target.value)}
            />
            <TextField
              margin="dense"
              label="City"
              fullWidth
              value={editData.city || ''}
              onChange={e => handleEditChange('city', e.target.value)}
            />
            <TextField
              margin="dense"
              label="Country"
              fullWidth
              value={editData.country || ''}
              onChange={e => handleEditChange('country', e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditSave} 
              variant="contained" 
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : null}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map(stat => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', boxShadow: 2, borderRadius: 3 }}>
                <Box sx={{ mr: 2 }}><BarChartIcon color="primary" /></Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a365d' }}>{stat.value}</Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>{stat.label}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: 2, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>My Products</Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Stock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map(row => (
                      <TableRow key={row.id}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.price}</TableCell>
                        <TableCell>{row.stock}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: 2, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Recent Orders</Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map(row => (
                      <TableRow key={row.id}>
                        <TableCell>{row.product}</TableCell>
                        <TableCell>{row.customer}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default VendorDashboard; 