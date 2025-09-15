import React from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';
import DemoNotice from './DemoNotice';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  userEmail: string;
  onLogout: () => void;
  onShowAuth: () => void;
}

const Layout: React.FC<LayoutProps> = ({ userEmail, onLogout, onShowAuth }) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <DemoNotice />
      <Header userEmail={userEmail} onLogout={onLogout} onShowAuth={onShowAuth} />
      <Outlet />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Layout;
