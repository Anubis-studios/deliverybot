import React, { useState } from 'react';

interface AuthScreenProps {
  onLogin: (prisonerId: string, codeword: string) => Promise<boolean>;
  onRegister: (username: string, codeword: string) => Promise<{ success: boolean; prisonerId: string }>;
  supportEmail: string;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onRegister, supportEmail }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [prisonerId, setPrisonerId] = useState('');
  const [username, setUsername] = useState('');
  const [codeword, setCodeword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(prisonerId, codeword);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await onRegister(username, codeword);
      if (result.success) {
        setRegistrationSuccess(result.prisonerId);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 border-2 border-green-500 p-8 max-w-md w-full font-mono">
          <h1 className="text-green-400 text-2xl mb-4">REGISTRATION COMPLETE</h1>
          <p className="text-gray-300 mb-4">Your prisoner ID has been assigned:</p>
          <div className="bg-black border border-green-500 p-4 mb-4">
            <p className="text-green-400 text-xl">{registrationSuccess}</p>
          </div>
          <p className="text-gray-400 text-sm mb-6">Memorize this ID. You will need it to login.</p>
          <button
            onClick={() => {
              setRegistrationSuccess(null);
              setPrisonerId(registrationSuccess);
              setIsLogin(true);
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          >
            CONTINUE TO LOGIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Scanline effect */}
        <div className="fixed inset-0 pointer-events-none opacity-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))',
            backgroundSize: '100% 4px'
          }}
        />

        <div className="relative bg-gray-800 border-2 border-gray-700 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-400 mb-2">PRISONBLOCK v2.0</h1>
            <p className="text-gray-400">Cell Block C - Terminal Access</p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-400 p-3 mb-4 font-mono text-sm">
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-green-400 mb-2 font-mono">Prisoner ID / Username</label>
                <input
                  type="text"
                  value={prisonerId}
                  onChange={(e) => setPrisonerId(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 text-white p-3 font-mono focus:border-green-500 focus:outline-none"
                  placeholder="Enter Prisoner ID or Warden Surge"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-green-400 mb-2 font-mono">Codeword</label>
                <input
                  type="password"
                  value={codeword}
                  onChange={(e) => setCodeword(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 text-white p-3 font-mono focus:border-green-500 focus:outline-none"
                  placeholder="Enter your codeword"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 font-mono mb-4"
              >
                {loading ? 'ACCESSING...' : 'ACCESS TERMINAL'}
              </button>
              <p className="text-center text-gray-400 text-sm">
                New inmate?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-green-400 hover:underline"
                >
                  Register here
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block text-green-400 mb-2 font-mono">Choose Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 text-white p-3 font-mono focus:border-green-500 focus:outline-none"
                  placeholder="Enter your desired username"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-green-400 mb-2 font-mono">Create Codeword</label>
                <input
                  type="password"
                  value={codeword}
                  onChange={(e) => setCodeword(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 text-white p-3 font-mono focus:border-green-500 focus:outline-none"
                  placeholder="Create a secure codeword"
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 font-mono mb-4"
              >
                {loading ? 'REGISTERING...' : 'REGISTER NEW INMATE'}
              </button>
              <p className="text-center text-gray-400 text-sm">
                Already have an ID?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-blue-400 hover:underline"
                >
                  Login here
                </button>
              </p>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-500 text-xs text-center font-mono">
              Support: {supportEmail}
            </p>
            <p className="text-gray-600 text-xs text-center mt-2">
              Owner: Warden Surge
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
