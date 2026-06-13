'use client';

import { useApp } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminPanel from '../../components/AdminPanel';

export default function AdminPage() {
  const { user, schedule, onScheduleUpdate } = useApp();
  const router = useRouter();

  const isAdmin = user?.username?.toLowerCase() === 'muddathiradmin' || user?.isAdmin === true;

  useEffect(() => {
    if (user && !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center pt-20">
        <div className="text-center">
          <span className="material-symbols-outlined text-error text-5xl mb-4 block">lock</span>
          <p className="font-bold text-on-surface">Admin access only</p>
        </div>
      </div>
    );
  }

  return (
    <AdminPanel
      user={user}
      schedule={schedule}
      onScheduleUpdate={onScheduleUpdate}
    />
  );
}
