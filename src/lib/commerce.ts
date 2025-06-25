import Commerce from '@chec/commerce.js';
import axios from 'axios';

export const REACT_APP_CHEC_PUBLIC_KEY = 'pk_521158705569372987beba0a223a42bea6dcdf3fe4b72';

export const commerce = new Commerce(REACT_APP_CHEC_PUBLIC_KEY, true);

const API_URL = 'http://localhost:4000';

// Interfaces
export interface Product {
  id: number;
  name: string;
  price: number;
  category?: string;
  vendorId?: number;
  [key: string]: unknown;
}

export interface Vendor {
  id: number;
  name: string;
  location?: string;
  [key: string]: unknown;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  businessName?: string;
  type: 'customer' | 'vendor';
  [key: string]: unknown;
}

export interface RegisterUserData {
  email: string;
  password: string;
  [key: string]: unknown;
}

// Product and Vendor functions
export async function getProducts(): Promise<Product[]> {
  const res = await axios.get<Product[]>(`${API_URL}/products`);
  return res.data;
}

export async function getVendors(): Promise<Vendor[]> {
  const res = await axios.get<Vendor[]>(`${API_URL}/vendors`);
  return res.data;
}

// Authentication functions
export async function loginUser(email: string, password: string): Promise<{ success: boolean; user?: User }> {
  try {
    const response = await axios.post<{ success: boolean; user?: User }>(`${API_URL}/auth/login`, {
      email,
      password
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

export async function registerUser(userData: RegisterUserData): Promise<{ success: boolean; user?: User }> {
  try {
    // For now, we'll use the login endpoint since registration isn't implemented yet
    const response = await axios.post<{ success: boolean; user?: User }>(`${API_URL}/auth/login`, {
      email: userData.email,
      password: userData.password
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}

// Customer functions
export async function getCustomerStats(userId: number): Promise<any[]> {
  const res = await axios.get<any[]>(`${API_URL}/customers/${userId}/stats`);
  return res.data;
}

export async function getCustomerOrders(userId: number): Promise<any[]> {
  const res = await axios.get<any[]>(`${API_URL}/customers/${userId}/orders`);
  return res.data;
}

export async function getCustomerWishlist(userId: number): Promise<any[]> {
  const res = await axios.get<any[]>(`${API_URL}/customers/${userId}/wishlist`);
  return res.data;
}

export async function updateCustomerProfile(userId: number, profileData: FormData): Promise<User> {
  const res = await axios.put<User>(`${API_URL}/customers/${userId}/profile`, profileData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}

// Vendor functions
export async function getVendorStats(userId: number): Promise<any[]> {
  const res = await axios.get<any[]>(`${API_URL}/vendors/${userId}/stats`);
  return res.data;
}

export async function getVendorProducts(userId: number): Promise<any[]> {
  const res = await axios.get<any[]>(`${API_URL}/vendors/${userId}/products`);
  return res.data;
}

export async function getVendorOrders(userId: number): Promise<any[]> {
  const res = await axios.get<any[]>(`${API_URL}/vendors/${userId}/orders`);
  return res.data;
}

export async function updateVendorProfile(userId: number, profileData: FormData): Promise<User> {
  const res = await axios.put<User>(`${API_URL}/vendors/${userId}/profile`, profileData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}

// Delivery options
export async function getDeliveryOptions(country?: string): Promise<any[]> {
  const params = country ? { country } : {};
  const res = await axios.get<any[]>(`${API_URL}/delivery-options`, { params });
  return res.data;
}