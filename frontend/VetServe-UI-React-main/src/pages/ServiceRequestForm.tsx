import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ServiceRequest, ServiceRequestFormData } from '../types';
import { serviceRequestsApi } from '../services/api';
import { PageLoader, LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const categories = [
  'Healthcare',
  'Employment',
  'Housing',
  'Mental Health',
  'Education',
  'Benefits',
  'Legal',
  'Financial',
  'Other',
];

const statuses: { value: ServiceRequest['status']; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function ServiceRequestForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated } = useAuth();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState(!isEdit);

  const [formData, setFormData] = useState<ServiceRequestFormData>({
    veteran_id: user?.veteranId ?? 0,
    category: 'Healthcare',
    description: '',
    status: 'pending',
  });

  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof ServiceRequestFormData, string>>
  >({});

  useEffect(() => {
    // keep veteran_id synced for new requests
    if (!isEdit) {
      setFormData((p) => ({ ...p, veteran_id: user?.veteranId ?? 0 }));
    }
  }, [user?.veteranId, isEdit]);

  useEffect(() => {
    if (id) loadRequest(parseInt(id, 10));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadRequest = async (requestId: number) => {
    try {
      setLoading(true);
      const data = await serviceRequestsApi.getById(requestId);

      // owner check is based on veteran_id (since DB user fields are null right now)
      const isOwner = user?.veteranId != null && data.veteran_id === user.veteranId;

      if (isAdmin || isOwner) {
        setCanEdit(true);
        setError(null);
      } else {
        setCanEdit(false);
        setError('You do not have permission to edit this request');
      }

      setFormData({
        veteran_id: data.veteran_id,
        category: data.category,
        description: data.description,
        status: data.status,
      });
    } catch {
      setError('Failed to load service request');
    } finally {
      setLoading(false);
    }
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof ServiceRequestFormData, string>> = {};

    if (!formData.veteran_id || formData.veteran_id <= 0) {
      errors.veteran_id = 'Valid Veteran ID is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      setError('You must be logged in to submit a request');
      return;
    }

    if (!validate()) return;

    setSaving(true);
    setError(null);

    try {
      if (isEdit && id) {
        await serviceRequestsApi.update(parseInt(id, 10), formData);
      } else {
        await serviceRequestsApi.create(formData); // ✅ only 1 arg
      }
      navigate('/service-requests');
    } catch {
      setError(`Failed to ${isEdit ? 'update' : 'create'} service request`);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ServiceRequestFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (loading) return <PageLoader />;

  if (isEdit && !canEdit) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">You can only edit your own service requests.</p>
            <Link
              to="/service-requests"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Service Requests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // for non-admin, lock veteran_id to their account
  const veteranIdLocked = !isAdmin && !isEdit;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/service-requests" className="hover:text-blue-600">
            Service Requests
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{isEdit ? 'Edit Request' : 'New Request'}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Service Request' : 'New Service Request'}</h1>
            <p className="text-gray-600 mt-1">
              {isEdit ? 'Update the details for this service request.' : 'Submit a new request for veteran assistance.'}
            </p>
            {user && !isEdit && (
              <p className="text-sm text-blue-600 mt-2">
                Submitting as: <span className="font-medium">{user.name}</span>
              </p>
            )}
          </div>

          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label htmlFor="veteran_id" className="block text-sm font-medium text-gray-700 mb-2">
                Veteran ID *
              </label>
              <input
                type="number"
                id="veteran_id"
                value={formData.veteran_id || ''}
                disabled={veteranIdLocked}
                onChange={(e) => handleChange('veteran_id', parseInt(e.target.value, 10) || 0)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  validationErrors.veteran_id ? 'border-red-300' : 'border-gray-200'
                } ${veteranIdLocked ? 'bg-gray-50 text-gray-500' : ''}`}
              />
              {validationErrors.veteran_id && <p className="mt-2 text-sm text-red-600">{validationErrors.veteran_id}</p>}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {isEdit && isAdmin && (
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as ServiceRequest['status'])}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200"
                >
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                rows={5}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  validationErrors.description ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {validationErrors.description && <p className="mt-2 text-sm text-red-600">{validationErrors.description}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <Link
                to="/service-requests"
                className="flex-1 px-4 py-3 text-center text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <LoadingSpinner size="sm" />}
                {saving ? 'Submitting...' : isEdit ? 'Update Request' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
