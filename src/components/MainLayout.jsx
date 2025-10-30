import React from 'react';
import Header from './Header';
import Footer from './Footer';
import SideNav from './SideNav';

const MainLayout = ({ children }) => (
  <div className="main-layout">
    <Header />
    <div className="layout-content" style={{display: 'flex', flexDirection: 'row'}}>
   
      <main className="main-content" style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '64px'}}>
        {children}
      </main>
    </div>
    <Footer />
  </div>
);

export default MainLayout;
