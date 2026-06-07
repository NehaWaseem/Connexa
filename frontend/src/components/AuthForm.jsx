import { useState } from 'react';
import { loginUser, registerUser } from '../services/api';

function AuthForm({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', password: '', email: '', phone: '', firstName: '', lastName: '' });
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (mode === 'login') {
        const result = await loginUser({ username: form.username, password: form.password });
        onLogin(result.token);
      } else {
        await registerUser({
          email: form.email,
          phone: form.phone,
          firstName: form.firstName,
          lastName: form.lastName,
          password: form.password,
        });
        setMode('login');
        setError('Registration successful. Please log in.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <label>Email</label>
              <input name="email" onChange={handleChange} value={form.email} required />
              <label>Phone</label>
              <input name="phone" onChange={handleChange} value={form.phone} required />
              <label>First Name</label>
              <input name="firstName" onChange={handleChange} value={form.firstName} required />
              <label>Last Name</label>
              <input name="lastName" onChange={handleChange} value={form.lastName} required />
            </>
          )}
          <label>{mode === 'login' ? 'Email or Phone' : 'Login Username'}</label>
          <input name="username" onChange={handleChange} value={form.username} required />
          <label>Password</label>
          <input name="password" type="password" onChange={handleChange} value={form.password} required />
          <button type="submit">{mode === 'login' ? 'Sign In' : 'Register'}</button>
        </form>
        <button className="secondary" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Create an account' : 'Back to login'}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;
