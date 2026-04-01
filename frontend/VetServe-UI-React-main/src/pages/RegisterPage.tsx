import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
type Branch = "Army" | "Navy" | "Air Force" | "Marines" | "Coast Guard" | "Space Force";

const BRANCHES: Branch[] = [
  "Army",
  "Navy",
  "Air Force",
  "Marines",
  "Coast Guard",
  "Space Force",
];

export default function RegisterPage() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState<Branch>("Army");
  const [email, setEmail] = useState(""); // optional

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setBusy(true);
    const result = await register({
      name,
      username,
      password,
      branch,                 // REQUIRED
      email: email.trim() ? email.trim() : undefined,
    });
    setBusy(false);

    if (!result.success) return setError(result.error ?? "Registration failed");
    nav("/service-requests");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-600 mt-1">Register to submit and track service requests.</p>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full name *</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Username *</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password *</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <p className="text-xs text-gray-500 mt-1">At least 6 characters.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Branch *</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
                value={branch}
                onChange={(e) => setBranch(e.target.value as Branch)}
                required
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email (optional)</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
              />
              <p className="text-xs text-gray-500 mt-1">
                If omitted, the server will generate a placeholder email.
              </p>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2.5 disabled:opacity-50"
            >
              {busy ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}