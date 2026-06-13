'use client';

import { use } from 'react';
import { useApp } from '../../../context/AppContext';
import { useRouter } from 'next/navigation';
import LessonView from '../../../components/LessonView';

export default function LessonPage({ params }) {
  const resolvedParams = use(params);
  const dayNum = parseInt(resolvedParams.day);
  const { user, schedule, onUserUpdate } = useApp();
  const router = useRouter();

  const day = schedule.find(d => d.day === dayNum);

  const handleBack = () => {
    router.push('/');
  };

  const handleComplete = () => {
    router.push('/');
  };

  if (!day) {
    return (
      <div className="flex-1 flex items-center justify-center pt-20">
        <div className="text-center">
          <span className="material-symbols-outlined text-primary text-5xl mb-4 block">search_off</span>
          <p className="font-bold text-on-surface">Lesson Day {dayNum} not found</p>
          <button
            onClick={handleBack}
            className="mt-4 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold cursor-pointer"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  return (
    <LessonView
      user={user}
      day={day}
      onBack={handleBack}
      onComplete={handleComplete}
      onUserUpdate={onUserUpdate}
    />
  );
}
