import React, { useState, MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

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
import ListItemIcon from '@mui/material/ListItemIcon';

// MUI Icon Imports
import TranslateIcon from '@mui/icons-material/Translate';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, showLoginModal, logout } = useAuth();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const location = useLocation();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = (): void => setAnchorElUser(null);
  const handleOpenLangMenu = (event: MouseEvent<HTMLElement>) => setAnchorElLang(event.currentTarget);
  const handleCloseLangMenu = () => setAnchorElLang(null);

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    handleCloseLangMenu();
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1B5E20' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            mr: 4,
            '&:hover': {
              color: '#e0e0e0'
            }
          }}
        >
          CropYieldPro
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            sx={{
              my: 2,
              color: 'white',
              fontWeight: 600,
              borderRadius: '20px',
              px: 3,
              transition: 'all 0.3s ease',
              backgroundColor: location.pathname === '/' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              },
            }}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/prediction"
            startIcon={<OnlinePredictionIcon />}
            sx={{
              my: 2,
              color: 'white',
              fontWeight: 600,
              borderRadius: '20px',
              px: 3,
              transition: 'all 0.3s ease',
              backgroundColor: location.pathname === '/prediction' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              },
            }}
          >
            Prediction
          </Button>
        </Box>

        {/* Language Selector */}
        <Tooltip title="Change Language">
          <IconButton 
            onClick={handleOpenLangMenu} 
            sx={{ 
              mr: 2,
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease'
            }}
          >
            <TranslateIcon />
          </IconButton>
        </Tooltip>
        
        <Menu
          anchorEl={anchorElLang}
          open={Boolean(anchorElLang)}
          onClose={handleCloseLangMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              mt: 1.5,
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1,
                fontSize: '0.9rem',
              },
            },
          }}
        >
          {availableLanguages.map((lang) => (
            <MenuItem 
              key={lang.code} 
              onClick={() => handleLanguageChange(lang.code)}
              selected={currentLanguage === lang.code}
              sx={{
                backgroundColor: currentLanguage === lang.code ? '#e8f5e8' : 'transparent',
                color: currentLanguage === lang.code ? '#1B5E20' : 'inherit',
                fontWeight: currentLanguage === lang.code ? '600' : 'normal',
                '&:hover': {
                  backgroundColor: currentLanguage === lang.code ? '#d0e8d0' : '#f5f5f5',
                },
              }}
            >
              {lang.name} {currentLanguage === lang.code && ' ✓'}
            </MenuItem>
          ))}
        </Menu>
        
        {isAuthenticated && user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'white',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Hello, {user.name}
            </Typography>
            <Tooltip title="Account settings">
              <IconButton 
                onClick={handleOpenUserMenu} 
                sx={{ 
                  p: 0,
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'transform 0.2s ease'
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: 'orange',
                    width: 32,
                    height: 32,
                    fontSize: '0.9rem'
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
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
              <MenuItem disabled sx={{ opacity: 1, fontWeight: 'bold', color: '#1B5E20' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'orange', 
                    width: 24, 
                    height: 24, 
                    fontSize: '0.8rem',
                    mr: 1
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
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
          <Button
            variant="contained"
            onClick={showLoginModal}
            startIcon={<LoginIcon />}
            sx={{
              backgroundColor: '#FF9800',
              color: 'white',
              borderRadius: '20px',
              fontWeight: 'bold',
              px: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#F57C00',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(255, 152, 0, 0.4)',
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