'use client';

import { useApp } from '../../context/AppContext';
import Settings from '../../components/Settings';

export default function SettingsPage() {
  const { user, onUserUpdate, onLogout } = useApp();

  return (
    <Settings
      user={user}
      onUserUpdate={onUserUpdate}
      onLogout={onLogout}
    />
  );
}
