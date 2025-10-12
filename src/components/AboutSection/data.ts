// src/components/AboutSection/data.ts
import { IconType } from 'react-icons'; // We need this for typing
import { FaPython, FaReact, FaAws, FaBrain, FaSatellite, FaMobileAlt, FaLanguage, FaUniversity, FaTractor, FaLeaf } from 'react-icons/fa';
import { SiPostgresql, SiTensorflow } from 'react-icons/si';
import { RiHandCoinFill } from 'react-icons/ri';

// Define reusable types for cleaner code
type Feature = { icon: IconType; title: string; description: string };
type Tech = { icon: IconType; name: string; role: string };
type Partner = { icon: IconType; name: string };

export const statsData = [
  { target: 95, label: 'Prediction Accuracy', suffix: '%' },
  { target: 10000, label: 'Farmers Served', suffix: '+' },
  { target: 15, label: 'Crop Types', suffix: '' },
  { target: 750, label: 'Villages Covered', suffix: '+' },
];

export const featuresData: Feature[] = [
  { icon: FaBrain, title: 'AI-Powered Predictions', description: 'Advanced ML algorithms analyze multiple data points for accurate yield forecasts.' },
  { icon: FaSatellite, title: 'Satellite Monitoring', description: 'Real-time crop health assessment using satellite imagery and remote sensing.' },
  { icon: FaMobileAlt, title: 'Mobile Accessibility', description: 'Access features on any device, even in areas with limited internet connectivity.' },
  { icon: FaLanguage, title: 'Multi-Language Support', description: 'Available in Telugu and other regional languages for better accessibility.' },
];

export const techStackData: Tech[] = [
  { icon: FaPython, name: 'Python', role: 'ML & Data Science' },
  { icon: FaReact, name: 'React', role: 'Frontend' },
  { icon: SiPostgresql, name: 'PostgreSQL', role: 'Database' },
  { icon: FaAws, name: 'AWS', role: 'Cloud Platform' },
  { icon: SiTensorflow, name: 'TensorFlow', role: 'AI Framework' },
];

export const teamMembersData = [
  { name: 'Dr. Rajesh Kumar', role: 'Agricultural Scientist', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80', description: 'PhD in Agricultural Science with 15+ years of experience in crop modeling.' },
  { name: 'Priya Sharma', role: 'Data Scientist', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', description: 'Machine learning expert specializing in agricultural predictive models.' },
  { name: 'Vikram Singh', role: 'Software Engineer', image: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=300&q=80', description: 'Full-stack developer with expertise in building scalable agricultural platforms.' },
];

export const partnersData: Partner[] = [
  { icon: FaUniversity, name: 'AP Agriculture University' },
  { icon: RiHandCoinFill, name: 'State Farming Cooperative' },
  { icon: FaTractor, name: 'Farm Equipment Providers' },
  { icon: FaLeaf, name: 'Organic Certification Board' },
];