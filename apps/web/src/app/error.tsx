'use client';

import React, {useEffect} from 'react';
import {Button} from '../components/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js Error Boundary:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">糟糕，出错了</h2>
      <p className="text-slate-600 mb-8 max-w-md">
        我们在加载页面时遇到了问题。这可能是由于最近的代码更改或缓存导致的。
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>重试</Button>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          刷新页面
        </Button>
      </div>
    </div>
  );
}
