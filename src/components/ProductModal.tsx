import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Button,
  IconButton,
  CardMedia,
  Rating,
  Chip,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '../theme';

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  rating: number;
  reviews: number;
  vendor: string;
  discount: string;
  description: string;
  inStock: boolean;
}

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product) => void;
  vendor?: { name: string; location: string };
}

const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  product,
  onAddToCart,
  vendor
}) => {
  if (!product) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {product.name}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 1 }}>
          Sold by: {vendor?.name} ({vendor?.location})
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              height="400"
              image={product.image}
              alt={product.name}
              sx={{ objectFit: 'cover', borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
              by {product.vendor}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.1} readOnly />
              <Typography variant="body2" sx={{ ml: 1, color: '#666' }}>
                {product.rating} ({product.reviews} reviews)
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.primary, mr: 2 }}>
                {product.price}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  textDecoration: 'line-through', 
                  color: '#999' 
                }}
              >
                {product.originalPrice}
              </Typography>
              <Chip 
                label={product.discount}
                sx={{ 
                  ml: 2,
                  backgroundColor: colors.accent,
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
            
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              {product.description}
            </Typography>
            
            <Button 
              variant="contained" 
              fullWidth
              size="large"
              disabled={!product.inStock}
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              sx={{ 
                backgroundColor: colors.primary,
                '&:hover': { backgroundColor: '#0f2a4a' },
                borderRadius: '20px',
                py: 1.5
              }}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal; 