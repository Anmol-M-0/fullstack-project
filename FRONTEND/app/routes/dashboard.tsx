import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Shield } from 'lucide-react';
import { api } from '../utils/api';
import type { Route } from './+types/dashboard';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - SecureApp" },
  ];
}

interface UserProfile {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await api.get('/users/me');
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div className="flex-center" style={{ minHeight: '60vh' }}>Loading...</div>;
  }

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2rem', marginBottom: '32px' }}>Dashboard</h1>
      
      <div className="glass-panel" style={{ padding: '32px', maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--primary-color)', padding: '16px', borderRadius: '50%' }}>
            <User size={32} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Welcome!</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Here is your profile information.</p>
          </div>
        </div>
        
        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Email Address</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 500 }}>{user.email}</div>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', flex: 1 }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Account Status</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: user.is_active ? 'var(--success-color)' : 'var(--error-color)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />
                  {user.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
              
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', flex: 1 }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Role</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={18} color={user.is_superuser ? 'var(--primary-color)' : 'var(--text-secondary)'} />
                  {user.is_superuser ? 'Superuser' : 'Standard User'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-error">Failed to load profile data.</div>
        )}
      </div>
    </div>
  );
}
