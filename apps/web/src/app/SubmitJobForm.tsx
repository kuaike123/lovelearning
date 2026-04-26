'use client';

import React, {FormEvent, useState} from 'react';

import {createJob} from '../lib/api-client';

export function SubmitJobForm({initialContent}: {initialContent: string}) {
  const [content, setContent] = useState(initialContent);
  const [taskName, setTaskName] = useState('');
  const [grade, setGrade] = useState<'junior'>('junior');
  const [targetDurationSec, setTargetDurationSec] = useState<30 | 45 | 60>(45);
  const [style, setStyle] = useState<'teacher' | 'kids' | 'exam'>('teacher');
  const [voice, setVoice] = useState<'female_warm' | 'female_clear' | 'male_calm'>('female_warm');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'failed'>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');

    try {
      const trimmedTaskName = taskName.trim();
      const job = await createJob({
        subject: 'math',
        grade,
        sourceType: 'text',
        ...(trimmedTaskName ? {taskName: trimmedTaskName} : {}),
        content,
        targetDurationSec,
        style,
        voice
      });
      window.location.assign(`/jobs/${job.jobId}`);
    } catch {
      setStatus('failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="taskName">任务名称</label>
      <input
        id="taskName"
        name="taskName"
        placeholder="例如：初一方程例题讲解"
        value={taskName}
        onChange={(event: {currentTarget: {value: string}}) => setTaskName(event.currentTarget.value)}
      />
      <label htmlFor="content">题目内容</label>
      <textarea
        id="content"
        name="content"
        value={content}
        onChange={(event: {currentTarget: {value: string}}) => setContent(event.currentTarget.value)}
      />
      <div style={optionsGridStyle}>
        <label htmlFor="grade">
          适用年级
          <select
            id="grade"
            name="grade"
            value={grade}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setGrade(event.currentTarget.value as 'junior')
            }
          >
            <option value="junior">初中</option>
          </select>
        </label>
        <label htmlFor="targetDurationSec">
          目标时长
          <select
            id="targetDurationSec"
            name="targetDurationSec"
            value={targetDurationSec}
            onChange={(event: {currentTarget: {value: string}}) =>
              setTargetDurationSec(Number(event.currentTarget.value) as 30 | 45 | 60)
            }
          >
            <option value={30}>30 秒</option>
            <option value={45}>45 秒</option>
            <option value={60}>60 秒</option>
          </select>
        </label>
        <label htmlFor="style">
          讲解风格
          <select
            id="style"
            name="style"
            value={style}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setStyle(event.currentTarget.value as 'teacher' | 'kids' | 'exam')
            }
          >
            <option value="teacher">老师讲解</option>
            <option value="kids">轻松启发</option>
            <option value="exam">应试提分</option>
          </select>
        </label>
        <label htmlFor="voice">
          配音音色
          <select
            id="voice"
            name="voice"
            value={voice}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setVoice(event.currentTarget.value as 'female_warm' | 'female_clear' | 'male_calm')
            }
          >
            <option value="female_warm">温柔女声</option>
            <option value="female_clear">清晰女声</option>
            <option value="male_calm">沉稳男声</option>
          </select>
        </label>
      </div>
      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? '正在生成...' : '生成视频'}
      </button>
      {status === 'failed' ? <p role="alert">创建任务失败，请稍后重试</p> : null}
    </form>
  );
}

const optionsGridStyle = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  margin: '16px 0'
};
