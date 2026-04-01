import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Home() {
  const { isAuthenticated, isAdmin, user } = useAuth();

  const features = [
    {
      icon: '📋',
      title: 'Resource Directory',
      description: 'Access a comprehensive database of veteran support services, benefits, and programs.',
      link: '/resources',
      linkText: 'Browse Resources'
    },
    {
      icon: '📝',
      title: 'Service Requests',
      description: 'Submit and track requests for assistance with various veteran services.',
      link: '/service-requests',
      linkText: 'View Requests'
    },
    {
      icon: '🏥',
      title: 'Healthcare',
      description: 'Find VA health care benefits, mental health services, and medical support.',
      link: '/resources',
      linkText: 'Learn More'
    },
    {
      icon: '💼',
      title: 'Employment',
      description: 'Career counseling, job placement, and vocational rehabilitation services.',
      link: '/resources',
      linkText: 'Find Jobs'
    },
    {
      icon: '🏠',
      title: 'Housing',
      description: 'Housing assistance programs including HUD-VASH and home loan benefits.',
      link: '/resources',
      linkText: 'Housing Help'
    },
    {
      icon: '🎓',
      title: 'Education',
      description: 'GI Bill benefits, education assistance, and training programs.',
      link: '/resources',
      linkText: 'Education Benefits'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
        
        {/* Top Navigation Bar */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-lg backdrop-blur">
                  <span className="text-2xl">🎖️</span>
                </div>
                <span className="text-xl font-bold text-white">VetServe</span>
              </div>
              
              <div className="flex items-center gap-4">
                <Link to="/resources" className="text-blue-100 hover:text-white transition-colors hidden sm:block">
                  Resources
                </Link>
                <Link to="/service-requests" className="text-blue-100 hover:text-white transition-colors hidden sm:block">
                  Requests
                </Link>
                <Link to="/register" className="text-blue-100 hover:text-white transition-colors hidden sm:block">
                  Register
                </Link>
                
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white text-sm hidden sm:block">{user?.name}</span>
                      {isAdmin && (
                        <span className="bg-amber-400 text-amber-900 text-xs px-2 py-0.5 rounded-full font-semibold">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/25"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur mb-8">
              <span className="text-5xl">🎖️</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Welcome to VetServe
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              A centralized platform connecting veterans with essential resources, benefits, and support services. 
              We're here to help you navigate the transition to civilian life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/resources"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-blue-900 bg-white rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Browse Resources
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              {isAdmin ? (
                <Link
                  to="/resources/new"
                  className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-white/20 rounded-xl hover:bg-white/30 transition-colors backdrop-blur"
                >
                  Add New Resource
                </Link>
              ) : (
                <Link
                  to="/service-requests"
                  className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-white/20 rounded-xl hover:bg-white/30 transition-colors backdrop-blur"
                >
                  View Service Requests
                </Link>
              )}
            </div>
            
            {!isAuthenticated && (
              <p className="mt-6 text-blue-200 text-sm">
                Are you an administrator?{' '}
                <Link to="/login" className="text-white underline hover:no-underline">
                  Sign in to manage resources
                </Link>
              </p>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">18M+</div>
            <div className="text-gray-600 mt-1">Veterans Served</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">500+</div>
            <div className="text-gray-600 mt-1">Partner Organizations</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">24/7</div>
            <div className="text-gray-600 mt-1">Support Available</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How Can We Help?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive suite of services designed to support veterans in every aspect of their lives.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <Link
                to={feature.link}
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
              >
                {feature.linkText}
                <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Immediate Assistance?</h2>
          <p className="text-xl text-blue-100 mb-8">
            The Veterans Crisis Line is available 24/7. Call, text, or chat.
          </p>
          <div className="inline-flex items-center gap-4 bg-white/10 rounded-xl px-6 py-4 backdrop-blur">
            <div className="text-left">
              <div className="text-2xl font-bold text-white">988 (Press 1)</div>
              <div className="text-blue-200">Or text 838255</div>
            </div>
            <div className="w-px h-12 bg-white/30"></div>
            <div className="text-5xl">📞</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎖️</span>
              <span className="text-lg font-semibold text-white">VetServe</span>
            </div>
            <p className="text-sm">
              © 2026 VetServe. Supporting veterans with dignity and respect.
            </p>
            <div className="flex gap-6">
              <Link to="/resources" className="hover:text-white transition-colors">Resources</Link>
              <Link to="/service-requests" className="hover:text-white transition-colors">Requests</Link>
              {!isAuthenticated && (
                <Link to="/login" className="hover:text-white transition-colors">Admin Login</Link>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
