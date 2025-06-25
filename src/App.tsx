import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePageNew from "./components/HomePageNew";
import AdminDashboard from './components/admin/AdminDashboard';
import FAQ from './components/FAQ';
import CustomerDashboard from './components/customers/CustomerDashboard';
import VendorDashboard from './components/vendors/VendorDashboard';
import { UserProvider } from './components/UserContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePageNew />,
  },
  {
    path: "/customer",
    element: <CustomerDashboard />,
  },
  {
    path: "/vendor",
    element: <VendorDashboard />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: '/faq',
    element: <FAQ />,
  },
]);

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
