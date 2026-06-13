'use client';

import { useApp } from '../context/AppContext';
import { useRouter } from 'next/navigation';
import DailyLessons from '../components/DailyLessons';

export default function HomePage() {
  const { user, currentDate, schedule, searchQuery } = useApp();
  const router = useRouter();

  const handleSelectDay = (dayNum, tab) => {
    // Flag so the daily lessons page knows to restore scroll when we come back
    sessionStorage.setItem('dailyLessons_fromLesson', '1');
    router.push('/lessons/' + dayNum + (tab ? '?tab=' + tab : ''));
  };

  return (
    <DailyLessons
      user={user}
      currentDate={currentDate}
      schedule={schedule}
      onSelectDay={handleSelectDay}
      searchQuery={searchQuery}
    />
  );
}
