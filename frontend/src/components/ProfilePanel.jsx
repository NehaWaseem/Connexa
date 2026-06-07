import { useState } from 'react';
import { changePassword } from '../services/api';

function ProfilePanel({ token, profile, onPasswordChanged }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState(null);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await changePassword(token, form);
      setMessage('Password updated');
      onPasswordChanged();
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="profile-card">
      <h2>Profile</h2>
      <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone:</strong> {profile.phone}</p>
      <h3>Change Password</h3>
      {message && <div className="info-message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <label>Current Password</label>
        <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} required />
        <label>New Password</label>
        <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} required />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ProfilePanel;
