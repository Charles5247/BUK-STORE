import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, AppBar, Toolbar, Card, Grid, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Chip, CircularProgress } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useState, useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import { getCustomerStats, getCustomerOrders, getCustomerWishlist, updateCustomerProfile } from '../../lib/commerce';

const drawerWidth = 220;

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon /> },
  { label: 'Orders', icon: <ShoppingCartIcon /> },
  { label: 'Wishlist', icon: <FavoriteIcon /> },
  { label: 'Profile', icon: <PersonIcon /> },
  { label: 'Help', icon: <HelpOutlineIcon /> },
  { label: 'Logout', icon: <LogoutIcon /> },
];

function useCustomerStats(userId) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!userId) return;
    getCustomerStats(userId)
      .then(setStats)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  return { stats, loading, error };
}

function useCustomerOrders(userId) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!userId) return;
    getCustomerOrders(userId)
      .then(setOrders)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  return { orders, loading, error };
}

function useCustomerWishlist(userId) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!userId) return;
    getCustomerWishlist(userId)
      .then(setWishlist)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  return { wishlist, loading, error };
}

const CustomerDashboard = () => {
  const { user, setUser } = useUser();
  const userId = user?.id;
  console.log('CustomerDashboard user:', user);
  console.log('CustomerDashboard userId:', userId);
  const profileData = user && user.type === 'customer' ? user : { 
    avatar: '', 
    name: '', 
    email: '', 
    phone: '', 
    studentId: '', 
    userType: '',
    city: '',
    country: ''
  };
  const { stats } = useCustomerStats(userId);
  const { orders } = useCustomerOrders(userId);
  const { wishlist } = useCustomerWishlist(userId);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(profileData);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
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
        setEditData(prev => ({ ...prev, avatar: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      console.log('Saving profile for userId:', userId);
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('email', editData.email);
      formData.append('phone', editData.phone);
      formData.append('studentId', editData.studentId);
      formData.append('userType', editData.userType);
      formData.append('city', editData.city);
      formData.append('country', editData.country);
      
      if (profileImage) {
        formData.append('avatar', profileImage);
      }

      // Make API call to update profile
      const updatedProfile = await updateCustomerProfile(userId, formData);
      
      // Update user context with new data
      setUser(updatedProfile);
      setEditOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setOrderModalOpen(true);
  };
  const handleLeaveReview = () => {
    setOrderModalOpen(false);
    setReviewModalOpen(true);
  };
  const handleSubmitReview = () => {
    // Demo: just close modal
    setReviewModalOpen(false);
    setReviewText('');
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
            background: 'linear-gradient(180deg, #1a365d 80%, #38a169 100%)',
            color: '#fff',
          },
        }}
      >
        <Toolbar sx={{ minHeight: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar src={profileData.avatar || ''} sx={{ width: 56, height: 56, mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1, textAlign: 'center' }}>
            {profileData.name || ''}
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
            <Avatar sx={{ bgcolor: '#1a365d', mr: 2 }}>C</Avatar>
            <Typography variant="subtitle1" sx={{ color: '#1a365d', fontWeight: 'bold' }}>Customer</Typography>
          </Toolbar>
        </AppBar>
        <Card sx={{ p: 3, mb: 4, display: 'flex', alignItems: 'center', boxShadow: 2, borderRadius: 3 }}>
          <Avatar src={profileData.avatar || ''} sx={{ width: 64, height: 64, mr: 3 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a365d' }}>{profileData.name || ''}</Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>{profileData.email || ''}</Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>Phone: {profileData.phone || ''}</Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>Student ID: {profileData.studentId || ''}</Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>User Type: {profileData.userType || ''}</Typography>
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
                src={editData.avatar || ''} 
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
                  Upload Photo
                </Button>
              </label>
            </Box>

            <TextField
              margin="dense"
              label="Name"
              fullWidth
              value={editData.name || ''}
              onChange={e => handleEditChange('name', e.target.value)}
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
              label="Student ID"
              fullWidth
              value={editData.studentId || ''}
              onChange={e => handleEditChange('studentId', e.target.value)}
            />
            <TextField
              margin="dense"
              label="User Type"
              select
              fullWidth
              value={editData.userType || ''}
              onChange={e => handleEditChange('userType', e.target.value)}
            >
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Faculty">Faculty</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
            </TextField>
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
                <Box sx={{ mr: 2 }}><DashboardIcon color="primary" /></Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a365d' }}>{stat.value}</Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>{stat.label}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 3, boxShadow: 2, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Recent Orders</Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map(row => (
                      <TableRow key={row.id} hover style={{ cursor: 'pointer' }} onClick={() => handleOrderClick(row)}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <img src={row.productImage} alt={row.product} style={{ width: 40, height: 40, borderRadius: 6, marginRight: 12 }} />
                            {row.product}
                          </Box>
                        </TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            color={row.status === 'Delivered' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{row.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3, boxShadow: 2, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Wishlist</Typography>
              <List>
                {wishlist.map(item => (
                  <ListItem key={item.id}>
                    <ListItemIcon><FavoriteIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={item.name} secondary={item.price} />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>
        <Dialog open={orderModalOpen} onClose={() => setOrderModalOpen(false)}>
          <DialogTitle>Order Details</DialogTitle>
          <DialogContent>
            {selectedOrder && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <img src={selectedOrder.productImage} alt={selectedOrder.product} style={{ width: 60, height: 60, borderRadius: 8, marginRight: 16 }} />
                  <Box>
                    <Typography variant="h6">{selectedOrder.product}</Typography>
                    <Typography variant="body2">Order Date: {selectedOrder.date}</Typography>
                    <Typography variant="body2">Status: <Chip label={selectedOrder.status} color={selectedOrder.status === 'Delivered' ? 'success' : 'warning'} size="small" /></Typography>
                    <Typography variant="body2">Amount: {selectedOrder.amount}</Typography>
                  </Box>
                </Box>
                {selectedOrder.status === 'Delivered' && (
                  <Button variant="contained" onClick={handleLeaveReview} sx={{ mt: 2 }}>Leave Review</Button>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOrderModalOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={reviewModalOpen} onClose={() => setReviewModalOpen(false)}>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogContent>
            <TextField
              label="Your Review"
              multiline
              rows={4}
              fullWidth
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReviewModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitReview} variant="contained">Submit</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CustomerDashboard; 