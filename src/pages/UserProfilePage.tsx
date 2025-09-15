import React from 'react';
import UserProfile from '../components/UserProfile';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const userEmail = auth.currentUser?.email || '';
  const handleClose = () => navigate(-1);

  return <UserProfile userEmail={userEmail} onClose={handleClose} />;
};

export default UserProfilePage;
