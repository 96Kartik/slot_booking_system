import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setTabNameLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();

    const data = {
      username: username,
      password: password,
      email: email
    };

    axios.post('/register/', data)
      .then(response => {
        setSuccess(true);
        setError(null);
      })
      .catch(error => {
        setError('Registration failed.');
        setSuccess(false);
      });
  };

  return (
    <div>
      <h1>Slot Booking System</h1>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit">Register</button>
        <br/>
        <br/>
        <a onClick={setTabNameLogin} style={{ color: 'blue' }}>Go Back to login...</a>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Registration successful!</p>}
    </div>
  );
};

export default Register;