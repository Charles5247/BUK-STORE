import axios from 'axios';
 
export async function getGeolocation() {
  const res = await axios.get('http://ip-api.com/json/');
  return res.data;
} 