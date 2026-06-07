import { useEffect, useState } from 'react';
import { fetchContacts, saveContact, deleteContact } from '../services/api';
import ContactModal from './ContactModal';

function ContactManager({ token }) {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const loadContacts = async () => {
    try {
      const data = await fetchContacts(token, page, search);
      setContacts(data.content);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [token, page, search]);

  const handleSave = async (contact) => {
    try {
      await saveContact(token, contact);
      setModalOpen(false);
      loadContacts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact?')) return;
    try {
      await deleteContact(token, id);
      loadContacts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="contacts-shell">
      <div className="toolbar">
        <button onClick={() => { setSelected(null); setModalOpen(true); }}>New Contact</button>
        <input placeholder="Search by name" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="contact-list">
        {contacts.map(contact => (
          <article key={contact.id} className="contact-card">
            <div>
              <strong>{contact.firstName} {contact.lastName}</strong>
              <p>{contact.title}</p>
            </div>
            <div className="actions">
              <button onClick={() => { setSelected(contact); setModalOpen(true); }}>Edit</button>
              <button onClick={() => handleDelete(contact.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
      {modalOpen && <ContactModal contact={selected} onSave={handleSave} onClose={() => setModalOpen(false)} />}
    </div>
  );
}

export default ContactManager;
