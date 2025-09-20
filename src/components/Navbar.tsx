import React, { useState, useEffect, MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Cookies from 'js-cookie'; // Import the js-cookie library

// MUI Imports
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon'; // For icons in menu

// MUI Icon Imports
import TranslateIcon from '@mui/icons-material/Translate';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home'; // Example icon
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction'; // Example icon

// TypeScript declaration for the Google Translate API
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit?: () => void;
  }
}

const stateToLang: { [key: string]: string } = {
  'Andhra Pradesh': 'te', // Telugu
  'Telangana': 'te',      // Telugu
  'Maharashtra': 'mr',    // Marathi
  'Karnataka': 'kn',      // Kannada
  'Tamil Nadu': 'ta',     // Tamil
  'Kerala': 'ml',         // Malayalam
  'West Bengal': 'bn',    // Bengali
  'Gujarat': 'gu',        // Gujarati
  'Punjab': 'pa',         // Punjabi
  'Uttar Pradesh': 'hi',  // Hindi
  'Delhi': 'hi',          // Hindi
  // Add more states here
};

// Data for languages and navigation links with icons
const languages = [
  { code: 'en', name: 'English' },
  { code: 'te', name: 'Telugu' },
  { code: 'hi', name: 'Hindi' },
];

const navLinks = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Prediction', path: '/prediction', icon: <OnlinePredictionIcon /> },
];

const Navbar: React.FC = () => {
  const { isAuthenticated, user, showLoginModal, logout } = useAuth();
  const location = useLocation();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({ pageLanguage: 'en', autoDisplay: false }, 'google_translate_element');
    };
    if (!document.querySelector('#google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
    return () => {
      const script = document.querySelector('#google-translate-script');
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window.googleTranslateElementInit;
    };
  }, []);
  // ✅ UPDATED LOGIC: Replaces the previous location-detection useEffect
 // The empty array [] ensures this effect runs only once
useEffect(() => {
    const setInitialLanguageByState = async () => {
      if (Cookies.get('googtrans')) {
        return; 
      }
      try {
        const response = await fetch('https://ip-api.com/json');
        if (!response.ok) throw new Error('Failed to fetch location data.');
        
        const data = await response.json();
        if (data.countryCode === 'IN') {
          const stateName = data.regionName;
          const detectedLang = stateToLang[stateName];
          if (detectedLang) {
            console.log(`State detected: ${stateName}. Setting language to: ${detectedLang}`);
            Cookies.set('googtrans', `/en/${detectedLang}`);
            window.location.reload();
          }
        }
      } catch (error) {
        console.error('Error auto-detecting language based on state:', error);
      }
    };
    setInitialLanguageByState();
  }, []);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleOpenLangMenu = (event: MouseEvent<HTMLElement>) => setAnchorElLang(event.currentTarget);
  const handleCloseLangMenu = () => setAnchorElLang(null);

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  // ✅ --- FIX: ROBUST LANGUAGE CHANGE FUNCTION ---
  const changeLanguage = (langCode: string) => {
    // Set the Google Translate cookie and reload the page.
    // This is the most reliable way to force a translation.
    Cookies.set('googtrans', `/en/${langCode}`);
    window.location.reload();
    handleCloseLangMenu();
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1B5E20' }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', mr: 4 }}>
          CropYieldPro
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navLinks.map((link) => (
            <Button
              key={link.label}
              component={Link}
              to={link.path}
              // ✨ ATTRACTIVE STYLE: Added icons and refined styling
              startIcon={link.icon}
              sx={{
                my: 2,
                color: 'white',
                fontWeight: 600,
                borderRadius: '20px', // Softer edges
                px: 3, // More padding
                transition: 'background-color 0.3s, transform 0.2s',
                backgroundColor: location.pathname === link.path ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)', // Subtle lift effect
                },
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>

        <div id="google_translate_element" style={{ display: 'none' }}></div>
        
        <Tooltip title="Change Language">
          <IconButton onClick={handleOpenLangMenu} sx={{ mr: 2 }}>
            <TranslateIcon sx={{ color: 'white' }} />
          </IconButton>
        </Tooltip>
        
        <Menu
          anchorEl={anchorElLang}
          open={Boolean(anchorElLang)}
          onClose={handleCloseLangMenu}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} onClick={() => changeLanguage(lang.code)}>
              {lang.name}
            </MenuItem>
          ))}
        </Menu>
        
        {isAuthenticated && user ? (
          <Box>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: 'orange' }}>{user.name.charAt(0).toUpperCase()}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem disabled sx={{ opacity: 1, fontWeight: 'bold' }}>
                 {user.name}
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          // ✨ ATTRACTIVE STYLE: Contained button with icon and hover effect
          <Button
            variant="contained"
            onClick={showLoginModal}
            startIcon={<LoginIcon />}
            sx={{
              backgroundColor: '#FF9800', // A vibrant orange
              color: 'black',
              borderRadius: '20px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s, transform 0.2s',
              '&:hover': {
                backgroundColor: '#F57C00',
                transform: 'scale(1.05)',
              },
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;