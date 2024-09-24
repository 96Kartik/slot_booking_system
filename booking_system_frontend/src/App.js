import React, { Component, useContext }  from 'react';
import logo from './logo.svg';
import './App.css';
import Booking from './components/booking';
import { AuthContext, AuthProvider } from './AuthContext';
import Login from './components/login';

function App() {
  const { isAuthenticated, login, logout } = useContext(AuthContext);
  return (
    <div className="App">
      {!isAuthenticated ? (
        <>
          <Login onLogin={login}/>
        </>
      ) : (
        <Booking onLogout={logout}/>
      )}
    </div>
  );
}

const RootApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default RootApp;
