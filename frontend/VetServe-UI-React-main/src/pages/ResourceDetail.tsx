import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { VeteranResource } from '../types';
import { resourcesApi } from '../services/api';
import { PageLoader } from '../components/LoadingSpinner';
import { DeleteModal } from '../components/DeleteModal';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const categoryColors: Record<string, string> = {
  'Healthcare': 'bg-red-100 text-red-700 border-red-200',
  'Employment': 'bg-green-100 text-green-700 border-green-200',
  'Housing': 'bg-blue-100 text-blue-700 border-blue-200',
  'Mental Health': 'bg-purple-100 text-purple-700 border-purple-200',
  'Education': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Benefits': 'bg-orange-100 text-orange-700 border-orange-200',
};

export function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [resource, setResource] = useState<VeteranResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) loadResource(parseInt(id));
  }, [id]);

  const loadResource = async (resourceId: number) => {
    try {
      setLoading(true);
      const data = await resourcesApi.getById(resourceId);
      if (!data) {
        setError('Resource not found');
      } else {
        setResource(data);
      }
    } catch (err) {
      setError('Failed to load resource');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!resource) return;
    
    setIsDeleting(true);
    try {
      await resourcesApi.delete(resource.resource_id);
      navigate('/resources', { replace: true });
    } catch (err) {
      setError('Failed to delete resource');
      setIsDeleting(false);
    }
  };

  if (loading) return <PageLoader />;

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Resource Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The resource you are looking for does not exist.'}</p>
          <Link
            to="/resources"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/resources" className="hover:text-blue-600">Resources</Link>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium truncate">{resource.title}</span>
        </nav>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium border',
                categoryColors[resource.category] || 'bg-gray-100 text-gray-700 border-gray-200'
              )}>
                {resource.category}
              </span>
              {resource.active ? (
                <span className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Active
                </span>
              ) : (
                <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Inactive
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{resource.title}</h1>
            
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{resource.organization}</span>
            </div>
          </div>

          {/* Description */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{resource.description}</p>
          </div>

          {/* Contact Info */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">Get in Touch</div>
                <div className="text-gray-600 mt-1">{resource.contact_info}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-8 bg-gray-50 flex flex-wrap gap-3 justify-between items-center">
            <Link
              to="/resources"
              className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Resources
            </Link>
            
            {isAdmin ? (
              <div className="flex gap-3">
                <Link
                  to={`/resources/${resource.resource_id}/edit`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Resource
                </Link>
                <button
                  onClick={() => setDeleteModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                <Link to="/login" className="text-blue-600 hover:underline">Sign in as admin</Link>
                {' '}to edit or delete this resource.
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModal}
        title="Delete Resource"
        message={`Are you sure you want to delete "${resource.title}"? This action cannot be undone.`}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(false)}
      />
    </div>
  );
}
