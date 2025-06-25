import { useEffect, useState } from 'react';
import { getGeolocation } from '../utils/geolocation';

export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getGeolocation()
      .then(data => {
        setLocation(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { location, loading, error };
} 