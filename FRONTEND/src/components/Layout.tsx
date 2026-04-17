import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export function Layout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="nav-brand">SecureApp</Link>
          {token && (
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>
      </nav>
      <main className="container" style={{ padding: '40px 24px' }}>
        <Outlet />
      </main>
    </>
  );
}
