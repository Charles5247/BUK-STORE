import { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, AppBar, Toolbar, Card, Grid, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const navItems = [
  { label: 'Overview', icon: <DashboardIcon /> },
  { label: 'Analytics', icon: <BarChartIcon /> },
  { label: 'Products', icon: <ListAltIcon /> },
  { label: 'Orders', icon: <ShoppingCartIcon /> },
  { label: 'Users', icon: <PeopleIcon /> },
  { label: 'Reports', icon: <AssessmentIcon /> },
  { label: 'Help', icon: <HelpOutlineIcon /> },
  { label: 'Logout', icon: <LogoutIcon /> },
];

function useAdminStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(setError).finally(() => setLoading(false));
  }, []);
  return { stats, loading, error };
}

function useAdminActivity() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch('/api/admin/activity').then(r => r.json()).then(setActivity).catch(setError).finally(() => setLoading(false));
  }, []);
  return { activity, loading, error };
}

const AdminDashboard = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { stats } = useAdminStats();
  const { activity } = useAdminActivity();

  const renderContent = () => {
    switch (navItems[selectedIndex].label) {
      case 'Overview':
        return (
          <>
            {/* Overview Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {stats.map((stat) => (
                <Grid item xs={12} sm={4} key={stat.label}>
                  <Card sx={{ p: 2, display: 'flex', alignItems: 'center', boxShadow: 2, borderRadius: 3 }}>
                    <Box sx={{ mr: 2 }}>{stat.icon}</Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a365d' }}>{stat.value}</Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>{stat.label}</Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={8}>
                <Card sx={{ p: 3, boxShadow: 2, borderRadius: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Sales Overview</Typography>
                  <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 24 }}>
                    [Bar Chart Here]
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3, boxShadow: 2, borderRadius: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Sales Breakdown</Typography>
                  <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 24 }}>
                    [Pie Chart Here]
                  </Box>
                </Card>
              </Grid>
            </Grid>
            {/* Recent Activity Table */}
            <Card sx={{ p: 3, boxShadow: 2, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Recent Activity</Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activity.map(row => (
                      <TableRow key={row.id}>
                        <TableCell>{row.user}</TableCell>
                        <TableCell>{row.action}</TableCell>
                        <TableCell>{row.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </>
        );
      case 'Analytics':
        return <Typography variant="h5">[Analytics Section Placeholder]</Typography>;
      case 'Products':
        return <Typography variant="h5">[Products Management Placeholder]</Typography>;
      case 'Orders':
        return <Typography variant="h5">[Orders Management Placeholder]</Typography>;
      case 'Users':
        return <Typography variant="h5">[Users Management Placeholder]</Typography>;
      case 'Reports':
        return <Typography variant="h5">[Reports Section Placeholder]</Typography>;
      case 'Help':
        return <Typography variant="h5">[Help Section Placeholder]</Typography>;
      case 'Logout':
        // You can implement logout logic here
        return <Typography variant="h5">[Logout Placeholder]</Typography>;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f4f7fa' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #1a365d 80%, #38a169 100%)',
            color: '#fff',
          },
        }}
      >
        <Toolbar sx={{ minHeight: 80 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
            E-MARKET ADMIN
          </Typography>
        </Toolbar>
        <Divider sx={{ background: 'rgba(255,255,255,0.2)' }} />
        <List>
          {navItems.map((item, idx) => (
            <ListItem button key={item.label} selected={selectedIndex === idx} onClick={() => setSelectedIndex(idx)} sx={{ my: 1, borderRadius: 2, '&:hover': { background: 'rgba(255,255,255,0.08)' }, background: selectedIndex === idx ? 'rgba(255,255,255,0.12)' : 'none' }}>
              <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, ml: `${drawerWidth}px` }}>
        <AppBar position="static" elevation={0} sx={{ background: 'transparent', boxShadow: 'none', mb: 4 }}>
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <Avatar sx={{ bgcolor: '#1a365d', mr: 2 }}>A</Avatar>
            <Typography variant="subtitle1" sx={{ color: '#1a365d', fontWeight: 'bold' }}>Admin</Typography>
          </Toolbar>
        </AppBar>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard; 