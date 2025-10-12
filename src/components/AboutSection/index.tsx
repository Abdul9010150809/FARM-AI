// src/components/AboutSection/index.tsx
import React from 'react';
import styles from './AboutSection.module.css';
import {
  statsData,
  featuresData,
  techStackData,
  teamMembersData,
  partnersData
} from './data';
import { StatItem } from './StatItem';
import { FaArrowRight, FaLinkedin, FaTwitter, FaEnvelope, FaMapMarkedAlt } from 'react-icons/fa';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-5 bg-light">
      <div className="container">
        <h2 className={`text-center ${styles.sectionTitle}`}>About CropYield Pro</h2>
        {/* ... Mission and Intro sections ... */}
        <div className="row justify-content-center mb-5"><div className="col-lg-10 text-center"><p className="lead">Empowering farmers in Andhra Pradesh with AI-driven insights to maximize yields, reduce risks, and increase profitability.</p></div></div>
        <div className="row align-items-center mb-5">
          <div className="col-lg-6">
            <h3>Revolutionizing Agriculture with AI</h3>
            <p>Our system analyzes soil health, weather patterns, historical yield data, and satellite imagery to provide accurate predictions and actionable recommendations.</p>
            <div className="row mt-4">{statsData.map((stat, index) => (<StatItem key={index} target={stat.target} label={stat.label} suffix={stat.suffix} />))}</div>
          </div>
          <div className="col-lg-6">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              {React.createElement(FaMapMarkedAlt as React.ComponentType<any>, { size: 70, className: "text-primary mx-auto mb-3" })}
              <h4>Andhra Pradesh Coverage</h4>
              <p className="text-muted">Interactive map showing crop distribution and regional insights.</p>
              <button className="btn btn-outline-primary mt-3">Explore Regional Data {React.createElement(FaArrowRight as React.ComponentType<any>, { className: "ms-2" })}</button>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <h3 className={`text-center ${styles.subheading}`}>Our Key Features</h3>
        <div className="row mb-5">
          {featuresData.map((feature, index) => {
            const IconComponent = feature.icon as React.ComponentType<any>;
            return (
              <div key={index} className="col-md-6 col-lg-3 mb-4">
                <div className={`card h-100 text-center p-4 border-0 ${styles.featureCard}`}>
                  <IconComponent className={`mx-auto ${styles.featureIcon}`} />
                  <h5>{feature.title}</h5>
                  <p className="text-muted small">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technology Stack */}
        <h3 className={`text-center ${styles.subheading}`}>Our Technology Stack</h3>
        <div className="row justify-content-center mb-5">
          {techStackData.map((tech) => {
            const IconComponent = tech.icon as React.ComponentType<any>;
            return (
              <div key={tech.name} className="col-lg-2 col-md-3 col-4 text-center mb-3">
                <div className={`p-3 rounded ${styles.techItem}`}>
                  <IconComponent size={40} className="text-primary mb-2" />
                  <h6>{tech.name}</h6>
                  <small className="text-muted">{tech.role}</small>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Team Section */}
        <h3 className={`text-center ${styles.subheading}`}>Our Expert Team</h3>
        <div className="row justify-content-center mb-5">
          {teamMembersData.map((member) => (
            <div key={member.name} className="col-md-4 mb-4">
              <div className={`card h-100 border-0 text-center p-4 ${styles.teamCard}`}>
                <img src={member.image} alt={member.name} className="rounded-circle mx-auto mb-3" style={{width: '120px', height: '120px', objectFit: 'cover'}} />
                <h5>{member.name}</h5>
                <p className="text-primary">{member.role}</p>
                <p className="text-muted small">{member.description}</p>
                <div className={`mt-3 ${styles.socialLinks}`}>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="mx-2">{React.createElement(FaLinkedin as React.ComponentType<any>)}</a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2">{React.createElement(FaTwitter as React.ComponentType<any>)}</a>
                  <a href={`mailto:${member.name.split(' ').join('.').toLowerCase()}@cropyieldpro.com`} className="mx-2">{React.createElement(FaEnvelope as React.ComponentType<any>)}</a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Partners */}
        <h3 className={`text-center ${styles.subheading}`}>Our Partners</h3>
        <div className="row justify-content-center align-items-center">
            {partnersData.map((partner) => {
              const IconComponent = partner.icon as React.ComponentType<any>;
              return (
                <div key={partner.name} className="col-md-3 col-6 text-center mb-4">
                  <div className={`p-3 rounded ${styles.partnerLogo}`}>
                      <IconComponent size={40} className="text-muted" />
                      <h6 className="mt-2">{partner.name}</h6>
                    </div>
                  </div>
                );
            })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;