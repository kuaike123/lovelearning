import React from 'react';
import Link from 'next/link';
import {Button} from '../components/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">页面未找到</h2>
      <p className="text-slate-600 mb-8">抱歉，您请求的页面不存在。</p>
      <Link href="/">
        <Button>返回首页</Button>
      </Link>
    </div>
  );
}
