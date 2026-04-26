import React from 'react';

import {RecentJobsPanel} from './RecentJobsPanel';
import {SubmitJobForm} from './SubmitJobForm';

type HomePageProps = {
  searchParams?: {
    content?: string;
  };
};

export default function HomePage({searchParams}: HomePageProps = {}) {
  const initialContent = searchParams?.content ?? '解方程：2x + 3 = 11';

  return (
    <main>
      <h1>数学讲解视频生成器</h1>
      <SubmitJobForm initialContent={initialContent} />
      <RecentJobsPanel />
    </main>
  );
}
