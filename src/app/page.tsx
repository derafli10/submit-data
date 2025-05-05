'use client';

import React, { useState } from 'react';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName]   = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.trim() || !name.trim()) {
      setError('Email dan nama wajib diisi.');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Unknown error');
      }
      setSuccess(true);
      setEmail('');
      setName('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-gray-300">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex max-w-3xl w-full h-[420px] mx-4">
        {/* Left: Image */}
        <div className="w-1/2 hidden md:block">
          <img
            src="/image2.jpg"
            alt="Illustration"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right: Register Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Register</h1>

          {error && <p className="text-red-600 mb-3">{error}</p>}
          {success && <p className="text-green-600 mb-3">Berhasil daftar!</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Masukkan email Anda"
                required
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Nama
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Masukkan nama Anda"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
