import { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { vehicleAPI } from './services/vehicleAPI';
import './App.css';

const PAGE_SIZE = 10;

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({ vehicle_code: '', vehicle_no: '' });
  const [errors, setErrors] = useState({});

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await vehicleAPI.getAll();
      setVehicles(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  // Reset to page 1 when search changes
  useEffect(() => { setCurrentPage(1); }, [search]);

  const validate = () => {
    const e = {};
    if (!form.vehicle_code.trim()) e.vehicle_code = 'Vehicle Code is required';
    else if (form.vehicle_code.trim().length < 3) e.vehicle_code = 'Minimum 3 characters required';
    if (!form.vehicle_no.trim()) e.vehicle_no = 'Vehicle Number is required';
    else if (form.vehicle_no.trim().length < 4) e.vehicle_no = 'Minimum 4 characters required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setFormLoading(true);
    try {
      if (editVehicle) {
        await vehicleAPI.update(editVehicle.id, form);
        toast.success('✅ Vehicle updated successfully!');
      } else {
        await vehicleAPI.add(form);
        toast.success('✅ Vehicle added successfully!');
      }
      resetForm();
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ vehicle_code: '', vehicle_no: '' });
    setErrors({});
    setShowForm(false);
    setEditVehicle(null);
  };

  const handleEdit = (v) => {
    setEditVehicle(v);
    setForm({ vehicle_code: v.vehicle_code, vehicle_no: v.vehicle_no });
    setErrors({});
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await vehicleAPI.delete(id);
      toast.success('🗑️ Vehicle deleted successfully!');
      setDeleteConfirm(null);
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  // ── DOWNLOAD CSV ──────────────────────────────────────────────────────────
  const downloadCSV = () => {
    const headers = ['#', 'Vehicle Code', 'Vehicle Number', 'Added On'];
    const rows = filtered.map((v, i) => [
      i + 1,
      v.vehicle_code,
      v.vehicle_no,
      formatDate(v.created_at),
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vehicles_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('📥 CSV downloaded!');
  };

  // ── FILTERED + PAGINATED ──────────────────────────────────────────────────
  const filtered = vehicles.filter(
    (v) =>
      v.vehicle_code.toLowerCase().includes(search.toLowerCase()) ||
      v.vehicle_no.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="app">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <div className="logo-area">
            <div className="logo-icon">V</div>
            <div>
              <div className="logo-title">Vehicle Management</div>
              <div className="logo-sub">Visible Infotech System</div>
            </div>
          </div>
          <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
            <span>+</span> Add New Vehicle
          </button>
        </div>
      </header>

      <main className="main">

        {/* FORM */}
        {showForm && (
          <div className="card form-card">
            <div className="card-header">
              <h2>{editVehicle ? '✏️ Edit Vehicle' : '🚗 Add New Vehicle'}</h2>
              <button className="btn-close" onClick={resetForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                <div className="field">
                  <label>Vehicle Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. VH001, TRK-01"
                    value={form.vehicle_code}
                    onChange={(e) => setForm({ ...form, vehicle_code: e.target.value })}
                    className={errors.vehicle_code ? 'error' : ''}
                  />
                  {errors.vehicle_code && <span className="err-msg">{errors.vehicle_code}</span>}
                </div>
                <div className="field">
                  <label>Vehicle Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. MH-12-AB-1234"
                    value={form.vehicle_no}
                    onChange={(e) => setForm({ ...form, vehicle_no: e.target.value })}
                    className={errors.vehicle_no ? 'error' : ''}
                  />
                  {errors.vehicle_no && <span className="err-msg">{errors.vehicle_no}</span>}
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={formLoading}>
                  {formLoading ? '⏳ Saving...' : editVehicle ? '💾 Update' : '➕ Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STATS */}
        <div className="stats-bar">
          <div className="stat">
            <div className="stat-num">{vehicles.length}</div>
            <div className="stat-label">Total Vehicles</div>
          </div>
          <div className="stat">
            <div className="stat-num">{filtered.length}</div>
            <div className="stat-label">Filtered Results</div>
          </div>
          <div className="stat">
            <div className="stat-num">{totalPages}</div>
            <div className="stat-label">Total Pages</div>
          </div>
        </div>

        {/* TABLE */}
        <div className="card">
          <div className="table-toolbar">
            <h2>🚛 Vehicle List</h2>
            <div className="toolbar-right">
              <input
                type="text"
                className="search-input"
                placeholder="🔍 Search by code or number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn-download" onClick={downloadCSV} title="Download CSV">
                📥 Download CSV
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading data...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚗</div>
              <p>{search ? 'No results found' : 'No vehicles added yet'}</p>
              {!search && (
                <button className="btn-primary" onClick={() => setShowForm(true)}>
                  Add First Vehicle
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Vehicle Code</th>
                      <th>Vehicle Number</th>
                      <th>Added On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((v, i) => (
                      <tr key={v.id} className={editVehicle?.id === v.id ? 'row-active' : ''}>
                        <td className="td-index">{(currentPage - 1) * PAGE_SIZE + i + 1}</td>
                        <td><span className="badge badge-code">{v.vehicle_code}</span></td>
                        <td><span className="badge badge-no">{v.vehicle_no}</span></td>
                        <td className="td-date">{formatDate(v.created_at)}</td>
                        <td>
                          <div className="action-btns">
                            <button className="btn-edit" onClick={() => handleEdit(v)} title="Edit">✏️</button>
                            <button className="btn-del" onClick={() => setDeleteConfirm(v)} title="Delete">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="pagination">
                  <div className="page-info">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} vehicles
                  </div>
                  <div className="page-controls">
                    {/* First */}
                    <button
                      className="page-btn"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      title="First page"
                    >«</button>

                    {/* Prev */}
                    <button
                      className="page-btn"
                      onClick={() => setCurrentPage((p) => p - 1)}
                      disabled={currentPage === 1}
                      title="Previous page"
                    >‹</button>

                    {/* Page numbers */}
                    {getPageNumbers().map((p) => (
                      <button
                        key={p}
                        className={`page-btn ${p === currentPage ? 'page-active' : ''}`}
                        onClick={() => setCurrentPage(p)}
                      >{p}</button>
                    ))}

                    {/* Next */}
                    <button
                      className="page-btn"
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={currentPage === totalPages}
                      title="Next page"
                    >›</button>

                    {/* Last */}
                    <button
                      className="page-btn"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      title="Last page"
                    >»</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* DELETE MODAL */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete <strong>{deleteConfirm.vehicle_code}</strong> ({deleteConfirm.vehicle_no})?
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>© 2026 Visible Infotech — Vehicle Management System v1.0</p>
      </footer>
    </div>
  );
}
