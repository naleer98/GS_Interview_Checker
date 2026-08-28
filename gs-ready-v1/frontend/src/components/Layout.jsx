import React, { useEffect } from 'react';
import {
  NavLink,
  Outlet,
  useLocation,
} from 'react-router-dom';

import {
  Home,
  FolderOpen,
  CheckCircle2,
  Star,
  User,
  CalendarDays,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

const nav = [
  ['/dashboard', Home, 'Home'],
  ['/documents', FolderOpen, 'Documents'],
  ['/checklist', CheckCircle2, 'Checklist'],
  ['/marks', Star, 'Marks'],
  ['/profile', User, 'Profile'],
];

export default function Layout() {
  const { user } = useAuth();
  const location = useLocation();

  // Route change aagumbodhu page top-ku reset pannum
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  return (
    <div className="app-shell">

      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            GS
          </span>

          <div>
            <b>GS Ready</b>
            <small>Interview Assistant</small>
          </div>
        </div>

        <nav className="side-nav">

          {nav.map(([to, Icon, label]) => (
            <NavLink
              key={to}
              to={to}
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}

          <NavLink to="/interview">
            <CalendarDays size={19} />
            Interview
          </NavLink>

        </nav>

        <div className="sidebar-user">
          <small>Signed in as</small>
          <b>{user?.name || 'User'}</b>
        </div>
      </aside>

      <main className="main-content">
        {/* IMPORTANT:
            pathname key remove panniyachu.
            Route navigation-la unnecessary
            remount avoid pannum.
        */}
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      <nav className="bottom-nav">

        {nav.map(([to, Icon, label]) => (
          <NavLink
            key={to}
            to={to}
          >
            <Icon size={21} />
            <span>{label}</span>
          </NavLink>
        ))}

      </nav>

    </div>
  );
}