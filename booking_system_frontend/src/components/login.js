import React, { useState } from 'react';
import axios from 'axios';
import Register from './register';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tabName, setTabName] = useState('Login');
  const [error, setError] = useState(null);
  const setTabNameLogin = () => {
    setTabName('Login')
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = {
      username: username,
      password: password
    };

    axios.post('/api/token/', data)
      .then(response => {
        const { access } = response.data;
        localStorage.setItem('token', access);  // Store the JWT token in localStorage
        setError(null);
        onLogin();  // Call the onLogin prop to update authentication state
      })
      .catch(error => {
        setError('Login failed.');
      });
  };

  return (
    tabName === "Register" ? 
    <Register setTabNameLogin={setTabNameLogin}/>
    :
    <div>
      <h1>Slot Booking System</h1>
      <h2>{tabName}</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br/>
        <br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br/>
        <br/>
        <button type="submit">Login</button>
        <br/>
        <br/>
        <a onClick={()=>setTabName("Register")} style={{ color: 'blue' }}>Click here to register...</a>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;