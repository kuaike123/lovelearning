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
      <h1>{'\u751f\u6210\u7ed3\u679c'}</h1>
      <JobResultPanel jobId={params.id} />
    </main>
  );
}
