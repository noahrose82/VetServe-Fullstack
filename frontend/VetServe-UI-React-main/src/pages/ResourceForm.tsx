import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ResourceFormData } from '../types';
import { resourcesApi } from '../services/api';
import { PageLoader, LoadingSpinner } from '../components/LoadingSpinner';

const categories = [
  'Healthcare',
  'Employment',
  'Housing',
  'Mental Health',
  'Education',
  'Benefits',
  'Community',
  'Legal',
  'Financial'
];

export function ResourceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ResourceFormData>({
    title: '',
    description: '',
    category: 'Healthcare',
    organization: '',
    contact_info: '',
    active: true
  });
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof ResourceFormData, string>>>({});

  useEffect(() => {
    if (id) loadResource(parseInt(id));
  }, [id]);

  const loadResource = async (resourceId: number) => {
    try {
      setLoading(true);
      const data = await resourcesApi.getById(resourceId);
      if (!data) {
        setError('Resource not found');
        return;
      }
      setFormData({
        title: data.title,
        description: data.description,
        category: data.category,
        organization: data.organization,
        contact_info: data.contact_info,
        active: data.active
      });
    } catch (err) {
      setError('Failed to load resource');
    } finally {
      setLoading(false);
    }
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof ResourceFormData, string>> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.organization.trim()) {
      errors.organization = 'Organization is required';
    }
    
    if (!formData.contact_info.trim()) {
      errors.contact_info = 'Contact information is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setSaving(true);
    setError(null);
    
    try {
      if (isEdit && id) {
        await resourcesApi.update(parseInt(id), formData);
      } else {
        await resourcesApi.create(formData);
      }
      navigate('/resources');
    } catch (err) {
      setError(`Failed to ${isEdit ? 'update' : 'create'} resource`);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ResourceFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/resources" className="hover:text-blue-600">Resources</Link>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">{isEdit ? 'Edit Resource' : 'New Resource'}</span>
        </nav>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Resource' : 'Add New Resource'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit 
                ? 'Update the information for this veteran resource.'
                : 'Fill in the details to add a new veteran resource.'
              }
            </p>
          </div>

          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  validationErrors.title 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                } focus:ring-2 focus:ring-offset-0 transition-colors`}
                placeholder="e.g., VA Health Care Benefits"
              />
              {validationErrors.title && (
                <p className="mt-2 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-0 transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Organization */}
            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                Organization *
              </label>
              <input
                type="text"
                id="organization"
                value={formData.organization}
                onChange={(e) => handleChange('organization', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  validationErrors.organization 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                } focus:ring-2 focus:ring-offset-0 transition-colors`}
                placeholder="e.g., Department of Veterans Affairs"
              />
              {validationErrors.organization && (
                <p className="mt-2 text-sm text-red-600">{validationErrors.organization}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  validationErrors.description 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                } focus:ring-2 focus:ring-offset-0 transition-colors resize-none`}
                placeholder="Describe the resource and how veterans can benefit from it..."
              />
              {validationErrors.description && (
                <p className="mt-2 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Information *
              </label>
              <input
                type="text"
                id="contact_info"
                value={formData.contact_info}
                onChange={(e) => handleChange('contact_info', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  validationErrors.contact_info 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                } focus:ring-2 focus:ring-offset-0 transition-colors`}
                placeholder="e.g., 1-800-827-1000 | email@va.gov"
              />
              {validationErrors.contact_info && (
                <p className="mt-2 text-sm text-red-600">{validationErrors.contact_info}</p>
              )}
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label htmlFor="active" className="text-sm font-medium text-gray-700">
                  Active Status
                </label>
                <p className="text-sm text-gray-500">Make this resource visible to users</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formData.active}
                onClick={() => handleChange('active', !formData.active)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.active ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Link
                to="/resources"
                className="flex-1 px-4 py-3 text-center text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving && <LoadingSpinner size="sm" />}
                {saving ? 'Saving...' : isEdit ? 'Update Resource' : 'Create Resource'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
