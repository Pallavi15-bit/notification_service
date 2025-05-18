import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Layout({ children }) {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <h1>Notification System</h1>
        </div>
      </header>
      
      <div className="app-body">
        <nav className="sidebar">
          <ul className="nav-links">
            <li className={isActive('/')}>
              <Link to="/">Dashboard</Link>
            </li>
          </ul>
        </nav>
        
        <main className="content">
          {children}
        </main>
      </div>
      
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Notification System</p>
      </footer>
    </div>
  );
}

export default Layout;
