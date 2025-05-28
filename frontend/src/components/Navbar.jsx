import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeClass = "underline font-semibold";

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <NavLink to="/" className="font-bold text-lg">
        EventManager
      </NavLink>
      <div className="space-x-4">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? activeClass : undefined)}
        >
          Home
        </NavLink>

        {user ? (
          <>
            {user.isAdmin && (
             <NavLink
               to="/admin"
               className={({ isActive }) => (isActive ? activeClass : undefined)}
             >
               Admin
             </NavLink>
            )}
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? activeClass : undefined)}
            >
              Dashboard
            </NavLink>
            <button onClick={handleLogout} className="underline ml-2">
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? activeClass : undefined)}
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? activeClass : undefined)}
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
