import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

const Login = ({ action }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (action === 'Login') {
        const { data } = await axios.post('https://task-management-0s3d.onrender.com/api/auth/login', { email, password });
        login(data.token, data.user.isAdmin);
        sessionStorage.setItem("name",data.user.name);
        alert(data.message);
        navigate('/Dashboard');
      }
      else if (action === 'Register') {
        const { data } = await axios.post('https://task-management-0s3d.onrender.com/api/auth/register', {name,email, password });
        login(data.token, data.user.isAdmin);
        sessionStorage.setItem("name",data.user.name);
        alert(data.message);
        navigate('/Dashboard');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="card w-50 mx-auto mt-5">
      <div className="card-body">
        <h3 className="card-title">{action}</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          {action === 'Register' && <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">{action}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;