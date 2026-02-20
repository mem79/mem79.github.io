import React, { useState, useEffect } from 'react';

/**
 * パスワードゲート
 * ここのパスワードを変更してください ↓
 */
const SITE_PASSWORD = 'umapedia2024';
const SESSION_KEY = 'umapedia_auth';

interface Props {
  children: React.ReactNode;
}

const PasswordGate: React.FC<Props> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === SITE_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setAuthenticated(true);
    } else {
      setError(true);
      setShake(true);
      setInput('');
      setTimeout(() => setShake(false), 600);
    }
  };

  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div
        className={`w-full max-w-sm bg-card border rounded-2xl shadow-xl p-8 space-y-6 ${shake ? 'animate-shake' : ''}`}
        style={shake ? { animation: 'shake 0.5s ease' } : {}}
      >
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="text-4xl">🍳</div>
          <h1 className="text-2xl font-bold">うまペディア</h1>
          <p className="text-sm text-muted-foreground">このサイトはプライベートです。<br />パスワードを入力してください。</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <input
              type="password"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false); }}
              placeholder="パスワード"
              autoFocus
              className={`flex h-11 w-full rounded-lg border ${error ? 'border-red-500' : 'border-input'} bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
            />
            {error && (
              <p className="text-xs text-red-500 text-center">パスワードが正しくありません</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full h-11 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            入室する
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
};

export default PasswordGate;
