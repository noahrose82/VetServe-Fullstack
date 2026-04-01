import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { ResourceList } from "./pages/ResourceList";
import { ResourceDetail } from "./pages/ResourceDetail";
import { ResourceForm } from "./pages/ResourceForm";
import { ServiceRequestList } from "./pages/ServiceRequestList";
import { ServiceRequestForm } from "./pages/ServiceRequestForm";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";


export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Home page without navbar */}
            <Route path="/" element={<Home />} />

            {/* Auth pages without navbar */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Pages with navbar */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    {/* Resource Routes - View is public */}
                    <Route path="/resources" element={<ResourceList />} />
                    <Route path="/resources/:id" element={<ResourceDetail />} />
                    <Route path="/register" element={<RegisterPage />} />


                    {/* Resource Admin Routes - Protected */}
                    <Route
                      path="/resources/new"
                      element={
                        <ProtectedRoute requireAdmin>
                          <ResourceForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/resources/:id/edit"
                      element={
                        <ProtectedRoute requireAdmin>
                          <ResourceForm />
                        </ProtectedRoute>
                      }
                    />

                    {/* Service Request Routes - Protected (backend will filter by user) */}
                    <Route
                      path="/service-requests"
                      element={
                        <ProtectedRoute>
                          <ServiceRequestList />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/service-requests/new"
                      element={
                        <ProtectedRoute>
                          <ServiceRequestForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/service-requests/:id/edit"
                      element={
                        <ProtectedRoute>
                          <ServiceRequestForm />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
