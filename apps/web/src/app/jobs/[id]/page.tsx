import React from 'react';

import {JobResultPanel} from './JobResultPanel';

type JobResultPageProps = {
  params: {
    id: string;
  };
};

export default function JobResultPage({params}: JobResultPageProps) {
  return (
    <main>
      <h1>Generation Result</h1>
      <JobResultPanel jobId={params.id} />
    </main>
  );
}
