import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CardMedia,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useGeolocation } from '../hooks/useGeolocation';

const colors = {
  primary: '#1a365d',
  accent: '#38a169'
};

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface ShoppingCartProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  open,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem
}) => {
  const { location, loading: geoLoading, error: geoError } = useGeolocation();

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseInt(item.price.replace('₦', '').replace(',', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getDeliveryOptions = () => {
    if (geoLoading) return <Typography>Loading delivery options...</Typography>;
    if (geoError || !location) return <Typography color="error">Unable to determine location. Showing all options.</Typography>;
    if (location.city === 'Kano' && location.country === 'Nigeria') {
      return (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Delivery Options</Typography>
          <List>
            <ListItem><ListItemText primary="Campus Delivery (1-2 days)" /></ListItem>
            <ListItem><ListItemText primary="Pickup from Vendor" /></ListItem>
          </List>
        </>
      );
    } else {
      return (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Delivery Options</Typography>
          <List>
            <ListItem><ListItemText primary="Pickup from Vendor (Recommended)" /></ListItem>
          </List>
          <Typography variant="body2" color="warning.main">Delivery is only available on campus. Please pick up your order from the vendor.</Typography>
        </>
      );
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 400,
          p: 2
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Shopping Cart ({getCartItemCount()})
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {cartItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <ShoppingCartIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
            Your cart is empty
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            Add some products to get started
          </Typography>
        </Box>
      ) : (
        <>
          <List sx={{ flex: 1 }}>
            {cartItems.map((item) => (
              <ListItem key={item.id} sx={{ border: '1px solid #eee', borderRadius: 2, mb: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                  image={item.image}
                  alt={item.name}
                />
                <ListItemText
                  primary={item.name}
                  secondary={`${item.price} x ${item.quantity}`}
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton 
                      size="small"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="body2">{item.quantity}</Typography>
                    <IconButton 
                      size="small"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => onRemoveItem(item.id)}
                      sx={{ color: '#f56565' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          <Box sx={{ borderTop: '1px solid #eee', pt: 2 }}>
            <Box sx={{ mb: 2 }}>
              {getDeliveryOptions()}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ₦{getCartTotal().toLocaleString()}
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              fullWidth
              sx={{ 
                backgroundColor: colors.primary,
                '&:hover': { backgroundColor: '#0f2a4a' },
                borderRadius: '20px',
                py: 1.5
              }}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default ShoppingCart; 