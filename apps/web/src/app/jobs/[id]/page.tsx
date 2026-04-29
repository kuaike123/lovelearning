import React from 'react';

import {JobResultPanel} from './JobResultPanel';

type JobResultPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobResultPage({params}: JobResultPageProps) {
  const {id} = await params;

  return (
    <main>
      <h1>{'\u751f\u6210\u7ed3\u679c'}</h1>
      <JobResultPanel jobId={id} />
    </main>
  );
}
