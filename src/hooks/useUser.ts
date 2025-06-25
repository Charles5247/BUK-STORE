import { useContext } from 'react';
import { UserContext } from '../components/UserContext';

export const useUser = () => useContext(UserContext); 