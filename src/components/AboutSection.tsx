import React, { useState, useEffect } from 'react';

const AboutSection: React.FC = () => {
  const [stats, setStats] = useState([
    { value: 95, label: 'Prediction Accuracy', suffix: '%' },
    { value: 0, label: 'Farmers Served', suffix: '+' },
    { value: 0, label: 'Crop Types', suffix: '' },
    { value: 0, label: 'Villages Covered', suffix: '+' }
  ]);

  // const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    // Animate stats counting up
    const intervals = stats.map((stat, index) => {
      let targetValue = index === 0 ? 95 : index === 1 ? 10000 : index === 2 ? 15 : 750;
      let increment = targetValue / 30;
      let current = 0;
      
      return setInterval(() => {
        current += increment;
        if (current >= targetValue) {
          current = targetValue;
          clearInterval(intervals[index]);
        }
        
        setStats(prev => prev.map((item, i) => 
          i === index ? { ...item, value: Math.floor(current) } : item
        ));
      }, 50);
    });

    return () => intervals.forEach(interval => clearInterval(interval));
  }, [stats]);

  const features = [
    {
      icon: 'fas fa-brain',
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning algorithms analyze multiple data points for accurate yield forecasts.'
    },
    {
      icon: 'fas fa-satellite',
      title: 'Satellite Monitoring',
      description: 'Real-time crop health assessment using satellite imagery and remote sensing technology.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Accessibility',
      description: 'Access all features on any device, even in areas with limited internet connectivity.'
    },
    {
      icon: 'fas fa-language',
      title: 'Multi-Language Support',
      description: 'Available in Telugu, Hindi, Tamil and other regional languages for better accessibility.'
    }
  ];

  const teamMembers = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Agricultural Scientist',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      description: 'PhD in Agricultural Science with 15+ years of experience in crop modeling.'
    },
    {
      name: 'Priya Sharma',
      role: 'Data Scientist',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      description: 'Machine learning expert specializing in agricultural predictive models.'
    },
    {
      name: 'Vikram Singh',
      role: 'Software Engineer',
      image: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      description: 'Full-stack developer with expertise in building scalable agricultural platforms.'
    }
  ];

  return (
    <section id="about" className="py-5 bg-light">
      <div className="container">
        <h2 className="section-title text-center">About CropYield Pro</h2>
        
        {/* Mission Statement */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10 text-center">
            <p className="lead">
              Empowering farmers in Andhra Pradesh with AI-driven insights to maximize yields, 
              reduce risks, and increase profitability through cutting-edge technology.
            </p>
          </div>
        </div>

        <div className="row align-items-center mb-5">
          <div className="col-lg-6">
            <h3>Revolutionizing Agriculture with AI</h3>
            <p>CropYield Pro leverages cutting-edge machine learning algorithms to help farmers in Andhra Pradesh maximize their crop yields and profitability.</p>
            <p>Our system analyzes multiple data points including soil health, weather patterns, historical yield data, and satellite imagery to provide accurate predictions and actionable recommendations.</p>
            
            {/* Animated Stats */}
            <div className="row mt-4">
              {stats.map((stat, index) => (
                <div key={index} className="col-6 col-md-3 text-center mb-4">
                  <div className="stat-number">{stat.value}{stat.suffix}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="interactive-map card h-100 border-0 shadow">
              <div className="card-body text-center p-4">
                <i className="fas fa-map-marked-alt fa-5x text-primary mb-3"></i>
                <h4>Andhra Pradesh Coverage</h4>
                <p className="text-muted">Interactive map showing crop distribution and regional insights</p>
                <div className="mt-3">
                  <span className="badge bg-primary me-2">Rice: 45%</span>
                  <span className="badge bg-success me-2">Chillies: 25%</span>
                  <span className="badge bg-warning text-dark">Cotton: 15%</span>
                </div>
                <button className="btn btn-outline-primary mt-3">
                  Explore Regional Data <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        

        {/* Technology Stack */}
        <div className="row mb-5">
          <div className="col-12">
            <h3 className="text-center mb-4">Our Technology Stack</h3>
            <div className="row justify-content-center">
              <div className="col-md-2 col-4 text-center mb-3">
                <div className="tech-item p-3">
                  <i className="fab fa-python fa-3x text-primary mb-2"></i>
                  <h6>Python</h6>
                  <small className="text-muted">ML & Data Science</small>
                </div>
              </div>
              <div className="col-md-2 col-4 text-center mb-3">
                <div className="tech-item p-3">
                  <i className="fab fa-react fa-3x text-primary mb-2"></i>
                  <h6>React</h6>
                  <small className="text-muted">Frontend</small>
                </div>
              </div>
              <div className="col-md-2 col-4 text-center mb-3">
                <div className="tech-item p-3">
                  <i className="fas fa-database fa-3x text-primary mb-2"></i>
                  <h6>PostgreSQL</h6>
                  <small className="text-muted">Database</small>
                </div>
              </div>
              <div className="col-md-2 col-4 text-center mb-3">
                <div className="tech-item p-3">
                  <i className="fas fa-cloud fa-3x text-primary mb-2"></i>
                  <h6>AWS</h6>
                  <small className="text-muted">Cloud Platform</small>
                </div>
              </div>
              <div className="col-md-2 col-4 text-center mb-3">
                <div className="tech-item p-3">
                  <i className="fas fa-robot fa-3x text-primary mb-2"></i>
                  <h6>TensorFlow</h6>
                  <small className="text-muted">AI Framework</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="row mb-5">
          <div className="col-12">
            <h3 className="text-center mb-4">Our Expert Team</h3>
            <div className="row justify-content-center">
              {teamMembers.map((member, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="team-card card h-100 border-0 text-center p-4">
                    <img src={member.image} alt={member.name} className="rounded-circle mx-auto mb-3" style={{width: '120px', height: '120px', objectFit: 'cover'}} />
                    <h5>{member.name}</h5>
                    <p className="text-primary">{member.role}</p>
                    <p className="text-muted">{member.description}</p>
                    <div className="social-links">
                      <a href="#" className="text-muted mx-2"><i className="fab fa-linkedin"></i></a>
                      <a href="#" className="text-muted mx-2"><i className="fab fa-twitter"></i></a>
                      <a href="#" className="text-muted mx-2"><i className="fas fa-envelope"></i></a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partners */}
        <div className="row">
          <div className="col-12">
            <h3 className="text-center mb-4">Our Partners</h3>
            <div className="row justify-content-center align-items-center">
              <div className="col-md-3 col-6 text-center mb-4">
                <div className="partner-logo p-3">
                  <i className="fas fa-university fa-3x text-muted"></i>
                  <h6 className="mt-2">AP Agriculture University</h6>
                </div>
              </div>
              <div className="col-md-3 col-6 text-center mb-4">
                <div className="partner-logo p-3">
                  <i className="fas fa-hand-holding-seedling fa-3x text-muted"></i>
                  <h6 className="mt-2">State Farming Cooperative</h6>
                </div>
              </div>
              <div className="col-md-3 col-6 text-center mb-4">
                <div className="partner-logo p-3">
                  <i className="fas fa-tractor fa-3x text-muted"></i>
                  <h6 className="mt-2">Farm Equipment Providers</h6>
                </div>
              </div>
              <div className="col-md-3 col-6 text-center mb-4">
                <div className="partner-logo p-3">
                  <i className="fas fa-leaf fa-3x text-muted"></i>
                  <h6 className="mt-2">Organic Certification Board</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline CSS for additional styling */}
      <style>
        {`
          .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2e7d32;
            transition: all 0.5s ease;
          }
          
          .stat-label {
            font-size: 0.9rem;
            color: #6c757d;
            font-weight: 500;
          }
          
          .feature-item {
            transition: all 0.3s ease;
            cursor: pointer;
          }
          
          .feature-item:hover, .feature-active {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          }
          
          .tech-item {
            transition: all 0.3s ease;
            border-radius: 10px;
          }
          
          .tech-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          
          .team-card {
            transition: all 0.3s ease;
          }
          
          .team-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          
          .social-links a {
            transition: color 0.3s ease;
          }
          
          .social-links a:hover {
            color: #2e7d32 !important;
          }
          
          .partner-logo {
            opacity: 0.7;
            transition: all 0.3s ease;
          }
          
          .partner-logo:hover {
            opacity: 1;
            transform: scale(1.05);
          }
          
          @keyframes countUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .stat-number {
            animation: countUp 1s ease-out;
          }
        `}
      </style>
    </section>
  );
};

export default AboutSection;