// src/pages/ProfilePage.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePageProps {
  isApiHealthy: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ isApiHealthy }) => {
  const { user } = useAuth();

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h2 className="mb-0">User Profile</h2>
            </div>
            <div className="card-body">
              {user ? (
                <div>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>User ID:</strong> {user.id}</p>
                </div>
              ) : (
                <p>Please log in to view your profile.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;