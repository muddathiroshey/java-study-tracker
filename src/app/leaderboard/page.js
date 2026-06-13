'use client';

import { useApp } from '../../context/AppContext';
import Leaderboard from '../../components/Leaderboard';

export default function LeaderboardPage() {
  const { user } = useApp();

  return <Leaderboard user={user} />;
}
