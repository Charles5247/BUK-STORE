const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Mock data
const products = [
  { id: 1, name: 'Vitamin C Serum', price: 3500, category: 'Skin Care', vendorId: 1 },
  { id: 2, name: 'Wireless Earbuds', price: 7000, category: 'Tech', vendorId: 2 },
  { id: 3, name: 'Jollof Rice', price: 1500, category: 'Food', vendorId: 5 },
];

const vendors = [
  { id: 1, name: 'Glow Skincare', location: 'Old Site' },
  { id: 2, name: 'Tech Hub', location: 'New Site' },
  { id: 5, name: 'Campus Bites', location: 'New Site' },
];

// Mock orders data
const orders = [
  { id: 1, userId: 1, product: 'Vitamin C Serum', status: 'Delivered', amount: 3500, date: '2024-06-01', country: 'Nigeria' },
  { id: 2, userId: 2, product: 'Wireless Earbuds', status: 'Pending', amount: 7000, date: '2024-06-10', country: 'Ghana' },
];

// Mock users for authentication
const users = [
  { 
    id: 1, 
    email: 'test@buk.edu.ng', 
    password: 'password', 
    name: 'Aisha Bello', 
    country: 'Nigeria',
    type: 'customer',
    phone: '+2348012345678',
    studentId: 'BUK/2021/001',
    userType: 'Student',
    city: 'Kano',
    avatar: ''
  },
  { 
    id: 2, 
    email: 'john@ghana.edu', 
    password: 'password', 
    name: 'John Mensah', 
    country: 'Ghana',
    type: 'customer',
    phone: '+233201234567',
    studentId: 'BUK/2021/002',
    userType: 'Student',
    city: 'Accra',
    avatar: ''
  },
  {
    id: 3,
    email: 'vendor@glow.com',
    password: 'password',
    businessName: 'Glow Skincare',
    businessType: 'Beauty & Health',
    type: 'vendor',
    phone: '+2348012345679',
    city: 'Kano',
    country: 'Nigeria',
    logo: ''
  }
];

// Mock customer data
const customers = {
  1: {
    stats: [
      { label: 'Total Orders', value: 15 },
      { label: 'Wishlist Items', value: 8 },
      { label: 'Total Spent', value: '₦45,000' }
    ],
    orders: [
      { id: 1, product: 'Vitamin C Serum', productImage: 'https://via.placeholder.com/40', status: 'Delivered', amount: '₦3,500', date: '2024-06-01' },
      { id: 2, product: 'Wireless Earbuds', productImage: 'https://via.placeholder.com/40', status: 'Pending', amount: '₦7,000', date: '2024-06-10' }
    ],
    wishlist: [
      { id: 1, name: 'Vitamin C Serum', price: '₦3,500' },
      { id: 2, name: 'Wireless Earbuds', price: '₦7,000' }
    ]
  },
  2: {
    stats: [
      { label: 'Total Orders', value: 8 },
      { label: 'Wishlist Items', value: 3 },
      { label: 'Total Spent', value: '₦25,000' }
    ],
    orders: [
      { id: 3, product: 'Jollof Rice', productImage: 'https://via.placeholder.com/40', status: 'Delivered', amount: '₦1,500', date: '2024-06-05' }
    ],
    wishlist: [
      { id: 3, name: 'Jollof Rice', price: '₦1,500' }
    ]
  }
};

// Mock vendor data
const vendorData = {
  3: {
    stats: [
      { label: 'Total Products', value: 25 },
      { label: 'Total Orders', value: 45 },
      { label: 'Revenue', value: '₦125,000' }
    ],
    products: [
      { id: 1, name: 'Vitamin C Serum', price: 3500, category: 'Skin Care', stock: 50 },
      { id: 4, name: 'Moisturizer', price: 2500, category: 'Skin Care', stock: 30 }
    ],
    orders: [
      { id: 1, customer: 'Aisha Bello', product: 'Vitamin C Serum', status: 'Delivered', amount: '₦3,500', date: '2024-06-01' },
      { id: 2, customer: 'John Mensah', product: 'Moisturizer', status: 'Pending', amount: '₦2,500', date: '2024-06-10' }
    ]
  }
};

// Mock delivery options by country
const deliveryOptions = {
  Nigeria: [
    { method: 'Campus Pickup', cost: 0, eta: 'Same Day' },
    { method: 'Local Courier', cost: 1000, eta: '1-2 Days' }
  ],
  Ghana: [
    { method: 'Campus Pickup', cost: 0, eta: 'Same Day' },
    { method: 'DHL', cost: 3000, eta: '2-4 Days' }
  ],
  Default: [
    { method: 'International Shipping', cost: 10000, eta: '5-10 Days' }
  ]
};

// Endpoints
app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/vendors', (req, res) => {
  res.json(vendors);
});

// Orders endpoint
app.get('/orders', (req, res) => {
  const { userId, country } = req.query;
  let filtered = orders;
  if (userId) filtered = filtered.filter(o => o.userId == userId);
  if (country) filtered = filtered.filter(o => o.country === country);
  res.json(filtered);
});

// Delivery options endpoint
app.get('/delivery-options', (req, res) => {
  const { country } = req.query;
  if (country && deliveryOptions[country]) {
    res.json(deliveryOptions[country]);
  } else {
    res.json(deliveryOptions.Default);
  }
});

// Customer endpoints
app.get('/customers/:id/stats', (req, res) => {
  const customerId = parseInt(req.params.id);
  const customer = customers[customerId];
  if (customer) {
    res.json(customer.stats);
  } else {
    res.json([]);
  }
});

app.get('/customers/:id/orders', (req, res) => {
  const customerId = parseInt(req.params.id);
  const customer = customers[customerId];
  if (customer) {
    res.json(customer.orders);
  } else {
    res.json([]);
  }
});

app.get('/customers/:id/wishlist', (req, res) => {
  const customerId = parseInt(req.params.id);
  const customer = customers[customerId];
  if (customer) {
    res.json(customer.wishlist);
  } else {
    res.json([]);
  }
});

app.put('/customers/:id/profile', upload.single('avatar'), (req, res) => {
  const customerId = parseInt(req.params.id);
  const user = users.find(u => u.id === customerId && u.type === 'customer');
  
  if (user) {
    // Update user data
    Object.assign(user, {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      phone: req.body.phone || user.phone,
      studentId: req.body.studentId || user.studentId,
      userType: req.body.userType || user.userType,
      city: req.body.city || user.city,
      country: req.body.country || user.country,
      avatar: req.file ? `/uploads/${req.file.filename}` : user.avatar
    });
    
    res.json(user);
  } else {
    res.status(404).json({ error: 'Customer not found' });
  }
});

// Vendor endpoints
app.get('/vendors/:id/stats', (req, res) => {
  const vendorId = parseInt(req.params.id);
  const vendor = vendorData[vendorId];
  if (vendor) {
    res.json(vendor.stats);
  } else {
    res.json([]);
  }
});

app.get('/vendors/:id/products', (req, res) => {
  const vendorId = parseInt(req.params.id);
  const vendor = vendorData[vendorId];
  if (vendor) {
    res.json(vendor.products);
  } else {
    res.json([]);
  }
});

app.get('/vendors/:id/orders', (req, res) => {
  const vendorId = parseInt(req.params.id);
  const vendor = vendorData[vendorId];
  if (vendor) {
    res.json(vendor.orders);
  } else {
    res.json([]);
  }
});

app.put('/vendors/:id/profile', upload.single('logo'), (req, res) => {
  const vendorId = parseInt(req.params.id);
  const user = users.find(u => u.id === vendorId && u.type === 'vendor');
  
  if (user) {
    // Update user data
    Object.assign(user, {
      businessName: req.body.businessName || user.businessName,
      businessType: req.body.businessType || user.businessType,
      email: req.body.email || user.email,
      phone: req.body.phone || user.phone,
      city: req.body.city || user.city,
      country: req.body.country || user.country,
      logo: req.file ? `/uploads/${req.file.filename}` : user.logo
    });
    
    res.json(user);
  } else {
    res.status(404).json({ error: 'Vendor not found' });
  }
});

// Mock authentication endpoint
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Debug logging
  console.log('Login attempt:', { email, password });
  console.log('Available users:', users.map(u => ({ email: u.email, type: u.type })));
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    console.log('Login successful for user:', user.name || user.businessName);
    res.json({ success: true, user: { 
      id: user.id, 
      name: user.name || user.businessName, 
      country: user.country, 
      email: user.email,
      type: user.type,
      phone: user.phone,
      studentId: user.studentId,
      userType: user.userType,
      businessName: user.businessName,
      businessType: user.businessType,
      city: user.city,
      avatar: user.avatar,
      logo: user.logo
    }});
  } else {
    console.log('Login failed - no matching user found');
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
}); 