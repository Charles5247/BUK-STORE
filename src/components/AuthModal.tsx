import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip
} from '@mui/material';
import { colors } from '../theme';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
  onLogin: (userData: Record<string, unknown>) => void;
  onRegister: (userData: Record<string, unknown>) => void;
  loading: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  mode,
  onModeChange,
  onLogin,
  onRegister,
  loading
}) => {
  const [userType, setUserType] = useState<'customer' | 'vendor'>('customer');

  // Customer form fields
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    studentId: '',
    userType: 'student' // student, faculty, staff
  });

  // Vendor form fields
  const [vendorData, setVendorData] = useState({
    businessName: '',
    businessType: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    businessLicense: '',
    taxId: '',
    bankAccount: '',
    bankName: ''
  });

  const handleCustomerChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const handleVendorChange = (field: string, value: string) => {
    setVendorData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'login') {
      onLogin({ userType, ...(userType === 'customer' ? customerData : vendorData) });
    } else {
      onRegister({ userType, ...(userType === 'customer' ? customerData : vendorData) });
    }
  };

  const isFormValid = () => {
    if (mode === 'login') {
      const data = userType === 'customer' ? customerData : vendorData;
      return data.email && data.password;
    } else {
      if (userType === 'customer') {
        return customerData.firstName && customerData.lastName && 
               customerData.email && customerData.password && 
               customerData.password === customerData.confirmPassword &&
               customerData.phone && customerData.studentId;
      } else {
        return vendorData.businessName && vendorData.businessType &&
               vendorData.email && vendorData.password &&
               vendorData.password === vendorData.confirmPassword &&
               vendorData.phone && vendorData.address &&
               vendorData.businessLicense && vendorData.taxId;
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        {mode === 'login' ? 'Login to Your Account' : 'Create New Account'}
      </DialogTitle>
      
      <DialogContent>
        {/* User Type Selection */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            I am a:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Chip
              label="Customer"
              onClick={() => setUserType('customer')}
              color={userType === 'customer' ? 'primary' : 'default'}
              variant={userType === 'customer' ? 'filled' : 'outlined'}
              sx={{ px: 3, py: 1, fontSize: '1rem' }}
            />
            <Chip
              label="Vendor"
              onClick={() => setUserType('vendor')}
              color={userType === 'vendor' ? 'primary' : 'default'}
              variant={userType === 'vendor' ? 'filled' : 'outlined'}
              sx={{ px: 3, py: 1, fontSize: '1rem' }}
            />
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          {mode === 'login' ? (
            // Login Form
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  required
                  value={userType === 'customer' ? customerData.email : vendorData.email}
                  onChange={(e) => userType === 'customer' 
                    ? handleCustomerChange('email', e.target.value)
                    : handleVendorChange('email', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  required
                  value={userType === 'customer' ? customerData.password : vendorData.password}
                  onChange={(e) => userType === 'customer'
                    ? handleCustomerChange('password', e.target.value)
                    : handleVendorChange('password', e.target.value)
                  }
                />
              </Grid>
            </Grid>
          ) : (
            // Registration Form
            <Grid container spacing={2}>
              {userType === 'customer' ? (
                // Customer Registration Fields
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      required
                      value={customerData.firstName}
                      onChange={(e) => handleCustomerChange('firstName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      required
                      value={customerData.lastName}
                      onChange={(e) => handleCustomerChange('lastName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      required
                      value={customerData.email}
                      onChange={(e) => handleCustomerChange('email', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      required
                      value={customerData.password}
                      onChange={(e) => handleCustomerChange('password', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      type="password"
                      required
                      value={customerData.confirmPassword}
                      onChange={(e) => handleCustomerChange('confirmPassword', e.target.value)}
                      error={customerData.password !== customerData.confirmPassword && customerData.confirmPassword !== ''}
                      helperText={customerData.password !== customerData.confirmPassword && customerData.confirmPassword !== '' ? 'Passwords do not match' : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      required
                      value={customerData.phone}
                      onChange={(e) => handleCustomerChange('phone', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Student ID"
                      required
                      value={customerData.studentId}
                      onChange={(e) => handleCustomerChange('studentId', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>User Type</InputLabel>
                      <Select
                        value={customerData.userType}
                        label="User Type"
                        onChange={(e) => handleCustomerChange('userType', e.target.value)}
                      >
                        <MenuItem value="student">Student</MenuItem>
                        <MenuItem value="faculty">Faculty</MenuItem>
                        <MenuItem value="staff">Staff</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                // Vendor Registration Fields
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Business Name"
                      required
                      value={vendorData.businessName}
                      onChange={(e) => handleVendorChange('businessName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Business Type"
                      required
                      value={vendorData.businessType}
                      onChange={(e) => handleVendorChange('businessType', e.target.value)}
                      placeholder="e.g., Electronics, Food, Clothing"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      required
                      value={vendorData.email}
                      onChange={(e) => handleVendorChange('email', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      required
                      value={vendorData.password}
                      onChange={(e) => handleVendorChange('password', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      type="password"
                      required
                      value={vendorData.confirmPassword}
                      onChange={(e) => handleVendorChange('confirmPassword', e.target.value)}
                      error={vendorData.password !== vendorData.confirmPassword && vendorData.confirmPassword !== ''}
                      helperText={vendorData.password !== vendorData.confirmPassword && vendorData.confirmPassword !== '' ? 'Passwords do not match' : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      required
                      value={vendorData.phone}
                      onChange={(e) => handleVendorChange('phone', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Business License Number"
                      required
                      value={vendorData.businessLicense}
                      onChange={(e) => handleVendorChange('businessLicense', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      required
                      value={vendorData.address}
                      onChange={(e) => handleVendorChange('address', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      required
                      value={vendorData.city}
                      onChange={(e) => handleVendorChange('city', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State"
                      required
                      value={vendorData.state}
                      onChange={(e) => handleVendorChange('state', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tax ID"
                      required
                      value={vendorData.taxId}
                      onChange={(e) => handleVendorChange('taxId', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bank Name"
                      required
                      value={vendorData.bankName}
                      onChange={(e) => handleVendorChange('bankName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bank Account Number"
                      required
                      value={vendorData.bankAccount}
                      onChange={(e) => handleVendorChange('bankAccount', e.target.value)}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onClose}
          sx={{ color: colors.text }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !isFormValid()}
          sx={{ 
            backgroundColor: colors.primary,
            '&:hover': { backgroundColor: '#0f2a4a' }
          }}
        >
          {loading ? 'Loading...' : (mode === 'login' ? 'Login' : 'Register')}
        </Button>
      </DialogActions>
      
      <Box sx={{ textAlign: 'center', pb: 2 }}>
        <Button 
          onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
          sx={{ color: colors.primary }}
        >
          {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default AuthModal; 