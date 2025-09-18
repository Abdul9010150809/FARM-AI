import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5>CropYield Pro</h5>
            <p>AI-powered crop yield prediction platform for farmers in Andhra Pradesh.</p>
            <div>
              <a href="#" className="social-icon"><i className="fab fa-facebook-f" /></a>
              <a href="#" className="social-icon"><i className="fab fa-twitter" /></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram" /></a>
              <a href="#" className="social-icon"><i className="fab fa-linkedin-in" /></a>
            </div>
          </div>
          <div className="col-md-2 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#prediction">Prediction</a></li>
              <li><a href="#crops">Crops</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h5>Resources</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="#">Weather Forecast</a></li>
              <li><a href="#">Soil Health</a></li>
              <li><a href="#">Crop Calendar</a></li>
              <li><a href="#">Market Prices</a></li>
              <li><a href="#">Government Schemes</a></li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li><i className="fas fa-map-marker-alt me-2" /> Vijayawada, Andhra Pradesh</li>
              <li><i className="fas fa-phone me-2" /> +91 9876543210</li>
              <li><i className="fas fa-envelope me-2" /> info@cropyieldpro.com</li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col-md-6">
            <p className="mb-0">&copy; 2023 CropYield Pro. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <a href="#" className="text-light me-3">Privacy Policy</a>
            <a href="#" className="text-light">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;