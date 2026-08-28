import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ExternalLink, FilePlus2, FileText, LoaderCircle, Trash2, X } from 'lucide-react';
import api, { FILE_BASE_URL } from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';

const categories = [
  'Identity',
  'Education',
  'Residence',
  'Leadership',
  'Sports',
  'Language',
  'ICT / Computer',
  'Other',
];

const newDocumentForm = () => ({
  title: '',
  category: 'Identity',
  institution: '',
  issueDate: '',
  originalAvailable: false,
  photocopyAvailable: false,
  notes: '',
  file: null,
});

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [form, setForm] = useState(newDocumentForm);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDocuments = useCallback(async () => {
    try {
      setError('');
      const response = await api.get('/documents', {
        headers: { 'Cache-Control': 'no-cache' },
      });

      // Defensive guard: the page should never crash even if the API response is unexpected.
      setDocs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Documents load error:', err);
      setDocs([]);
      setError(err.response?.data?.message || 'Could not load documents. Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const grouped = useMemo(() => {
    const safeDocs = Array.isArray(docs) ? docs : [];
    return categories
      .map((category) => [category, safeDocs.filter((doc) => doc?.category === category)])
      .filter(([, items]) => items.length > 0);
  }, [docs]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('title', form.title.trim());
      fd.append('category', form.category);
      fd.append('institution', form.institution.trim());
      fd.append('issueDate', form.issueDate);
      fd.append('originalAvailable', String(form.originalAvailable));
      fd.append('photocopyAvailable', String(form.photocopyAvailable));
      fd.append('notes', form.notes.trim());
      if (form.file) fd.append('file', form.file);

      await api.post('/documents', fd);
      setForm(newDocumentForm());
      setOpen(false);
      setLoading(true);
      await loadDocuments();
    } catch (err) {
      console.error('Document upload error:', err);
      setError(err.response?.data?.message || 'Upload failed. Please check the file and try again.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!id || !window.confirm('Delete this document?')) return;

    try {
      setError('');
      await api.delete(`/documents/${id}`);
      setLoading(true);
      await loadDocuments();
    } catch (err) {
      console.error('Document delete error:', err);
      setError(err.response?.data?.message || 'Could not delete this document.');
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="My Documents"
        subtitle="Certificates, ID and evidence files ஒரே இடத்தில் வைத்துக்கொள்ளுங்கள்."
        action={(
          <button className="btn primary" type="button" onClick={() => setOpen(true)}>
            <FilePlus2 size={17} />
            Add Document
          </button>
        )}
      />

      {error && <div className="alert error">{error}</div>}

      {loading ? (
        <div className="card empty">
          <LoaderCircle className="spin" size={34} />
          <h3>Loading documents…</h3>
          <p>Please wait a moment.</p>
        </div>
      ) : grouped.length === 0 ? (
        <div className="card empty">
          <FileText size={34} />
          <h3>No documents yet</h3>
          <p>Add your first certificate or identity document.</p>
          <button className="btn primary" type="button" onClick={() => setOpen(true)}>
            <FilePlus2 size={17} />
            Add First Document
          </button>
        </div>
      ) : (
        <div className="doc-groups">
          {grouped.map(([category, items]) => (
            <section className="card" key={category}>
              <div className="card-title">
                <h2>{category}</h2>
                <span className="badge">{items.length}</span>
              </div>

              <div className="doc-list">
                {items.map((doc) => (
                  <div className="doc-item" key={doc._id || `${category}-${doc.title}`}>
                    <div className="doc-icon"><FileText /></div>
                    <div className="doc-info">
                      <b>{doc.title || 'Untitled document'}</b>
                      <span>
                        {doc.institution || 'No institution'}
                        {doc.issueDate ? ` • ${doc.issueDate}` : ''}
                      </span>
                      <div className="chips">
                        <span className={doc.originalAvailable ? 'chip ok' : 'chip'}>
                          Original {doc.originalAvailable ? '✓' : '—'}
                        </span>
                        <span className={doc.photocopyAvailable ? 'chip ok' : 'chip'}>
                          Copy {doc.photocopyAvailable ? '✓' : '—'}
                        </span>
                      </div>
                    </div>

                    <div className="doc-actions">
                      {doc.fileUrl ? (
                        <a
                          className="icon-btn"
                          href={`${FILE_BASE_URL}${doc.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Open file"
                        >
                          <ExternalLink size={17} />
                        </a>
                      ) : null}
                      <button
                        className="icon-btn danger"
                        type="button"
                        onClick={() => remove(doc._id)}
                        title="Delete document"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {open && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => !busy && setOpen(false)}>
          <form className="modal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <h2>Add Document</h2>
              <button className="icon-btn" type="button" onClick={() => setOpen(false)} disabled={busy}>
                <X />
              </button>
            </div>

            <label>
              Document Name
              <input
                required
                value={form.title}
                onChange={(event) => updateForm('title', event.target.value)}
                placeholder="Example: NIC / O/L Certificate"
              />
            </label>

            <label>
              Category
              <select value={form.category} onChange={(event) => updateForm('category', event.target.value)}>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>

            <div className="form-grid">
              <label>
                Institution
                <input
                  value={form.institution}
                  onChange={(event) => updateForm('institution', event.target.value)}
                  placeholder="Optional"
                />
              </label>
              <label>
                Issue Date
                <input
                  type="date"
                  value={form.issueDate}
                  onChange={(event) => updateForm('issueDate', event.target.value)}
                />
              </label>
            </div>

            <label>
              File (PDF / JPG / PNG / WEBP / DOC / DOCX, max 8 MB)
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                onChange={(event) => updateForm('file', event.target.files?.[0] || null)}
              />
            </label>

            <div className="switch-row">
              <label className="check">
                <input
                  type="checkbox"
                  checked={form.originalAvailable}
                  onChange={(event) => updateForm('originalAvailable', event.target.checked)}
                />
                Original available
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={form.photocopyAvailable}
                  onChange={(event) => updateForm('photocopyAvailable', event.target.checked)}
                />
                Photocopy ready
              </label>
            </div>

            <label>
              Notes
              <textarea
                rows="3"
                value={form.notes}
                onChange={(event) => updateForm('notes', event.target.value)}
                placeholder="Optional notes"
              />
            </label>

            <button className="btn primary wide" disabled={busy}>
              {busy ? 'Saving…' : 'Save Document'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
