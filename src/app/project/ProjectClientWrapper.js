'use client';

import { useApp } from '../../context/AppContext';
import ProjectView from '../../components/ProjectView';

export default function ProjectClientWrapper() {
  const { user } = useApp();
  if (!user) return null;
  return <ProjectView user={user} />;
}
