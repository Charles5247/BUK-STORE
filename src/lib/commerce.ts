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
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(axiosError.response?.data?.message || 'Login failed');
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
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(axiosError.response?.data?.message || 'Registration failed');
  }
}

// Customer functions
export async function getCustomerStats(userId: number): Promise<Array<{ label: string; value: string | number }>> {
  const res = await axios.get<Array<{ label: string; value: string | number }>>(`${API_URL}/customers/${userId}/stats`);
  return res.data;
}

export async function getCustomerOrders(userId: number): Promise<Array<{ id: number; product: string; productImage: string; status: string; amount: string; date: string }>> {
  const res = await axios.get<Array<{ id: number; product: string; productImage: string; status: string; amount: string; date: string }>>(`${API_URL}/customers/${userId}/orders`);
  return res.data;
}

export async function getCustomerWishlist(userId: number): Promise<Array<{ id: number; name: string; price: string }>> {
  const res = await axios.get<Array<{ id: number; name: string; price: string }>>(`${API_URL}/customers/${userId}/wishlist`);
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
export async function getVendorStats(userId: number): Promise<Array<{ label: string; value: string | number }>> {
  const res = await axios.get<Array<{ label: string; value: string | number }>>(`${API_URL}/vendors/${userId}/stats`);
  return res.data;
}

export async function getVendorProducts(userId: number): Promise<Array<{ id: number; name: string; price: number; category: string; stock: number }>> {
  const res = await axios.get<Array<{ id: number; name: string; price: number; category: string; stock: number }>>(`${API_URL}/vendors/${userId}/products`);
  return res.data;
}

export async function getVendorOrders(userId: number): Promise<Array<{ id: number; customer: string; product: string; status: string; amount: string; date: string }>> {
  const res = await axios.get<Array<{ id: number; customer: string; product: string; status: string; amount: string; date: string }>>(`${API_URL}/vendors/${userId}/orders`);
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
export async function getDeliveryOptions(country?: string): Promise<Array<{ method: string; cost: number; eta: string }>> {
  const params = country ? { country } : {};
  const res = await axios.get<Array<{ method: string; cost: number; eta: string }>>(`${API_URL}/delivery-options`, { params });
  return res.data;
}