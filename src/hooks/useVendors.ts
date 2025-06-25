import { useState, useEffect } from 'react';
import { getVendors } from '../lib/commerce';

export const useVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getVendors()
      .then(setVendors)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { vendors, loading, error };
}; 