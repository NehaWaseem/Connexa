import { useEffect, useState } from 'react';
import AuthForm from './components/AuthForm';
import ContactManager from './components/ContactManager';
import ProfilePanel from './components/ProfilePanel';
import { getProfile } from './services/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('connexaToken'));
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (token) {
      getProfile(token)
        .then(data => setProfile(data))
        .catch(() => {
          localStorage.removeItem('connexaToken');
          setToken(null);
        });
    }
  }, [token]);

  const handleLogin = (newToken) => {
    localStorage.setItem('connexaToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('connexaToken');
    setToken(null);
    setProfile(null);
  };

  if (!token) {
    return <AuthForm onLogin={handleLogin} />;
  }

  if (!profile) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="app-shell">
      <header>
        <div>
          <h1>Connexa Contacts</h1>
          <p>Welcome, {profile.firstName} {profile.lastName}</p>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <main>
        <section className="side-panel">
          <ProfilePanel token={token} profile={profile} onPasswordChanged={() => alert('Password updated successfully')} />
        </section>
        <section className="content-panel">
          <ContactManager token={token} />
        </section>
      </main>
    </div>
  );
}

export default App;
