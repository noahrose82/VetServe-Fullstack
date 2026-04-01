import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ServiceRequest } from '../types';
import { serviceRequestsApi, veteransApi } from '../services/api';
import { PageLoader, LoadingSpinner } from '../components/LoadingSpinner';
import { DeleteModal } from '../components/DeleteModal';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const statusConfig: Record<ServiceRequest['status'], { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-800 border-gray-200' },
};

const ITEMS_PER_PAGE = 10;

export function ServiceRequestList() {
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [veteranNameById, setVeteranNameById] = useState<Record<number, string>>({});

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; request: ServiceRequest | null }>({
    isOpen: false,
    request: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const [vets, result] = await Promise.all([
          veteransApi.getAll().catch(() => []),
          serviceRequestsApi.getAll(ITEMS_PER_PAGE, 0), //   only 2 args
        ]);

        const map: Record<number, string> = {};
        for (const v of vets) map[v.id] = v.name;
        setVeteranNameById(map);

        setRequests(result.data);
        setTotal(result.total);
        setError(null);
      } catch {
        setError('Failed to load service requests');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredRequests = useMemo(() => {
    if (isAdmin) return requests;

    if (!isAuthenticated) return [];

    const vid = user?.veteranId;
    if (!vid) return [];

    return requests.filter((r) => r.veteran_id === vid);
  }, [requests, isAdmin, isAuthenticated, user?.veteranId]);

  const requestsWithNames = useMemo(() => {
    return filteredRequests.map((r) => ({
      ...r,
      veteran_name: veteranNameById[r.veteran_id] ?? 'Unknown',
    }));
  }, [filteredRequests, veteranNameById]);

  const loadMore = async () => {
    try {
      setLoadingMore(true);
      const result = await serviceRequestsApi.getAll(ITEMS_PER_PAGE, requests.length); //   only 2 args
      setRequests((prev) => [...prev, ...result.data]);
      setTotal(result.total);
    } catch {
      setError('Failed to load more requests');
    } finally {
      setLoadingMore(false);
    }
  };

  const canModify = (req: ServiceRequest) => {
    if (!isAuthenticated) return false;
    if (isAdmin) return true;
    return user?.veteranId != null && req.veteran_id === user.veteranId;
  };

  const handleDelete = async () => {
    if (!deleteModal.request) return;

    setIsDeleting(true);
    try {
      await serviceRequestsApi.delete(deleteModal.request.id);
      setRequests((prev) => prev.filter((r) => r.id !== deleteModal.request!.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setDeleteModal({ isOpen: false, request: null });
    } catch {
      setError('Failed to delete request');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isAdmin ? 'All Service Requests' : 'My Service Requests'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isAdmin
                ? 'View and manage all veteran assistance requests.'
                : 'Only requests linked to your account are shown.'}
            </p>
          </div>

          {isAuthenticated && (
            <Link
              to="/service-requests/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Request
            </Link>
          )}
        </div>

        {!isAuthenticated && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
            <Link to="/login" className="font-medium underline hover:no-underline">
              Sign in
            </Link>{' '}
            to submit and view your service requests.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
        )}

        {requestsWithNames.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isAuthenticated ? 'No service requests yet' : 'Sign in to view requests'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isAuthenticated ? 'Submit your first service request to get started.' : 'Please sign in first.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ID</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Veteran</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Veteran ID</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Description</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Created</th>
                    {isAuthenticated && (
                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {requestsWithNames.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">#{request.id}</td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span className="inline-flex items-center">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium mr-2">
                            {(request.veteran_name ?? 'U').charAt(0)}
                          </span>
                          {request.veteran_name ?? 'Unknown'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">{request.veteran_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{request.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{request.description}</td>

                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
                            statusConfig[request.status].className
                          )}
                        >
                          {statusConfig[request.status].label}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(request.created_at)}</td>

                      {isAuthenticated && (
                        <td className="px-6 py-4 text-right">
                          {canModify(request) ? (
                            <div className="flex justify-end gap-2">
                              <Link
                                to={`/service-requests/${request.id}/edit`}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                ✏️
                              </Link>

                              <button
                                onClick={() => setDeleteModal({ isOpen: true, request })}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">No actions</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {requests.length < total && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
                >
                  {loadingMore && <LoadingSpinner size="sm" className="mr-2" />}
                  {loadingMore ? 'Loading...' : `Load More (${requests.length} loaded / ${total} total in system)`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Service Request"
        message={`Are you sure you want to delete request #${deleteModal.request?.id}? This action cannot be undone.`}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, request: null })}
      />
    </div>
  );
}
