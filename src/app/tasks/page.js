'use client';

import { useApp } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import TasksBoard from '../../components/TasksBoard';

export default function TasksPage() {
  const { user, schedule } = useApp();
  const router = useRouter();

  const handleSelectDay = (dayNum) => {
    router.push('/lessons/' + dayNum + '?tab=code');
  };

  return (
    <TasksBoard
      user={user}
      schedule={schedule}
      onSelectDay={handleSelectDay}
    />
  );
}
