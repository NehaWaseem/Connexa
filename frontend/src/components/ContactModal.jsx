import { useState } from 'react';

function ContactModal({ contact, onSave, onClose }) {
  const [form, setForm] = useState(contact || {
    firstName: '',
    lastName: '',
    title: '',
    emails: [{ label: 'work', email: '' }],
    phones: [{ label: 'mobile', number: '' }],
  });

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleListChange = (listKey, index, key) => (event) => {
    const updated = form[listKey].map((item, idx) => idx === index ? { ...item, [key]: event.target.value } : item);
    setForm({ ...form, [listKey]: updated });
  };

  const addEntry = (listKey) => {
    setForm({ ...form, [listKey]: [...form[listKey], { label: '', [listKey === 'emails' ? 'email' : 'number']: '' }] });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>{contact ? 'Edit Contact' : 'Create Contact'}</h3>
        <form onSubmit={handleSubmit}>
          <label>First Name</label>
          <input value={form.firstName} onChange={handleChange('firstName')} required />
          <label>Last Name</label>
          <input value={form.lastName} onChange={handleChange('lastName')} required />
          <label>Title</label>
          <input value={form.title} onChange={handleChange('title')} />

          <fieldset>
            <legend>Emails</legend>
            {form.emails.map((email, index) => (
              <div key={index} className="list-row">
                <input placeholder="Label" value={email.label} onChange={handleListChange('emails', index, 'label')} required />
                <input placeholder="Email" value={email.email} onChange={handleListChange('emails', index, 'email')} required />
              </div>
            ))}
            <button type="button" onClick={() => addEntry('emails')}>Add Email</button>
          </fieldset>

          <fieldset>
            <legend>Phones</legend>
            {form.phones.map((phone, index) => (
              <div key={index} className="list-row">
                <input placeholder="Label" value={phone.label} onChange={handleListChange('phones', index, 'label')} required />
                <input placeholder="Number" value={phone.number} onChange={handleListChange('phones', index, 'number')} required />
              </div>
            ))}
            <button type="button" onClick={() => addEntry('phones')}>Add Phone</button>
          </fieldset>

          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" className="secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactModal;
