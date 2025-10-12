// src/components/Footer.tsx

import React, { useState, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
// 1. Import IconType to define the type of our icons
import { IconType } from 'react-icons'; 
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

// --- Data for the footer ---
const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Features', path: '/features' },
  { name: 'Prediction', path: '/prediction' },
  { name: 'Crops', path: '/crops' },
  { name: 'About', path: '/about' },
];

const resources = [
  { name: 'Weather Forecast', path: '/resources/weather' },
  { name: 'Soil Health', path: '/resources/soil' },
  { name: 'Crop Calendar', path: '/resources/calendar' },
  { name: 'Market Prices', path: '/resources/market' },
  { name: 'Government Schemes', path: '/resources/schemes' },
];

// 2. Add the correct type for the 'icon' property
const socialLinks: { name: string; icon: IconType; path: string }[] = [
  { name: 'Facebook', icon: FaFacebookF, path: 'https://facebook.com' },
  { name: 'Twitter', icon: FaTwitter, path: 'https://twitter.com' },
  { name: 'Instagram', icon: FaInstagram, path: 'https://instagram.com' },
  { name: 'LinkedIn', icon: FaLinkedinIn, path: 'https://linkedin.com' },
];

const contactInfo = {
  location: 'Vijayawada, Andhra Pradesh',
  phone: '+91 9876543210',
  email: 'info@cropyieldpro.com',
};
// --- End of Data ---


const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  // --- Styles (remain the same) ---
  const styles: { [key: string]: CSSProperties } = {
    footer: { backgroundColor: '#212529', color: '#adb5bd', padding: '4rem 0', lineHeight: '1.6' },
    container: { maxWidth: '1140px', margin: '0 auto', padding: '0 15px' },
    row: { display: 'flex', flexWrap: 'wrap', margin: '0 -15px' },
    column: { flex: '1 1 250px', padding: '0 15px', marginBottom: '2rem' },
    title: { color: '#ffffff', marginBottom: '1.5rem', fontSize: '1.1rem' },
    list: { listStyle: 'none', padding: 0 },
    listItem: { marginBottom: '0.75rem' },
    link: { color: '#adb5bd', textDecoration: 'none', transition: 'color 0.2s ease-in-out' },
    linkHover: { color: '#ffffff' },
    socialContainer: { display: 'flex', marginTop: '1.5rem' },
    socialIcon: { color: '#adb5bd', fontSize: '1.2rem', marginRight: '1.5rem', transition: 'color 0.2s ease-in-out, transform 0.2s ease' },
    socialIconHover: { color: '#ffffff', transform: 'scale(1.2)' },
    contactItem: { display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem' },
    contactIcon: { marginRight: '10px', marginTop: '4px', color: '#ffffff' },
    hr: { border: '0', borderTop: '1px solid #343a40', margin: '2rem 0' },
    bottomRow: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' },
    copyright: { margin: 0 },
    bottomLinks: { textAlign: 'right' },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.row}>
          {/* Column 1: Brand and Social */}
          <div style={styles.column}>
            <h5 style={styles.title}>CropYield Pro</h5>
            <p>AI-powered crop yield prediction platform for farmers in Andhra Pradesh.</p>
            <div style={styles.socialContainer}>
              {socialLinks.map((social) => {
                // 3. Assign the icon to a capitalized variable before rendering
                const Icon = social.icon as React.ComponentType<any>;
                return (
                  <a
                    key={social.name}
                    href={social.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.name}`}
                    style={{
                      ...styles.socialIcon,
                      ...(hoveredSocial === social.name ? styles.socialIconHover : {})
                    }}
                    onMouseEnter={() => setHoveredSocial(social.name)}
                    onMouseLeave={() => setHoveredSocial(null)}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2 & 3: Links */}
          <div style={styles.column}>
            <h5 style={styles.title}>Quick Links</h5>
            <ul style={styles.list}>
              {quickLinks.map((link) => (
                <li key={link.name} style={styles.listItem}>
                  <Link 
                    to={link.path}
                    style={{...styles.link, ...(hoveredLink === link.name ? styles.linkHover : {})}}
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div style={styles.column}>
            <h5 style={styles.title}>Resources</h5>
            <ul style={styles.list}>
              {resources.map((link) => (
                <li key={link.name} style={styles.listItem}>
                  <Link
                    to={link.path}
                    style={{...styles.link, ...(hoveredLink === link.name + 'res' ? styles.linkHover : {})}}
                    onMouseEnter={() => setHoveredLink(link.name + 'res')}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div style={styles.column}>
            <h5 style={styles.title}>Contact Us</h5>
            <ul style={styles.list}>
                {/* No changes needed here because FiMapPin etc. are already capitalized */}
              <li style={styles.contactItem}>{React.createElement(FiMapPin as React.ComponentType<any>, { style: styles.contactIcon })} {contactInfo.location}</li>
              <li style={styles.contactItem}>{React.createElement(FiPhone as React.ComponentType<any>, { style: styles.contactIcon })} {contactInfo.phone}</li>
              <li style={styles.contactItem}>{React.createElement(FiMail as React.ComponentType<any>, { style: styles.contactIcon })} {contactInfo.email}</li>
            </ul>
          </div>
        </div>

        <hr style={styles.hr} />

        <div style={styles.bottomRow}>
          <p style={styles.copyright}>&copy; {currentYear} CropYield Pro. All rights reserved.</p>
          <div style={styles.bottomLinks}>
            <Link 
              to="/privacy-policy" 
              style={{...styles.link, ...{marginRight: '1rem'}, ...(hoveredLink === 'privacy' ? styles.linkHover : {})}}
              onMouseEnter={() => setHoveredLink('privacy')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms-of-service"
              style={{...styles.link, ...(hoveredLink === 'terms' ? styles.linkHover : {})}}
              onMouseEnter={() => setHoveredLink('terms')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;