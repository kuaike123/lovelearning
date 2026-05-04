import React from 'react';

import {designTokens} from '../styles/tokens';
import {Card} from './Card';

type TaskStatus = 'completed' | 'failed' | 'queued' | 'running' | string;

export type TaskListItem = {
  createdAt?: string;
  href: string;
  id: string;
  status?: TaskStatus;
  thumbnailUrl?: string;
  title: string;
};

type TaskListProps = {
  search?: string;
  sortBy?: 'createdAt' | 'status' | 'title';
  tasks: TaskListItem[];
};

export function TaskList({search = '', sortBy = 'createdAt', tasks}: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => compareTasks(a, b, sortBy));

  return (
    <div data-task-list="grid" style={gridStyle}>
      {sortedTasks.map((task) => (
        <a data-task-card={task.id} href={task.href} key={task.id} style={linkStyle}>
          <Card elevation="low">
            <div
              data-thumbnail-state={task.thumbnailUrl ? 'loaded' : 'skeleton'}
              style={{
                aspectRatio: '16 / 9',
                background: task.thumbnailUrl ? `url(${task.thumbnailUrl}) center / cover` : designTokens.colors.neutral100,
                borderRadius: designTokens.radii.md,
                marginBottom: designTokens.spacing[4]
              }}
            />
            <div style={{display: 'grid', gap: designTokens.spacing[2]}}>
              <strong style={{color: designTokens.colors.neutral900}}>
                {highlightText(task.title, search)}
              </strong>
              <span style={{color: designTokens.colors.neutral600, fontSize: designTokens.typography.sizeSm}}>
                {task.createdAt ? new Date(task.createdAt).toLocaleString('zh-CN') : '未记录时间'}
              </span>
              <span data-status={task.status ?? 'queued'} style={statusStyle(task.status)}>
                {statusLabel(task.status)}
              </span>
            </div>
          </Card>
        </a>
      ))}
    </div>
  );
}

const compareTasks = (a: TaskListItem, b: TaskListItem, sortBy: NonNullable<TaskListProps['sortBy']>) => {
  if (sortBy === 'title') return a.title.localeCompare(b.title, 'zh-CN');
  if (sortBy === 'status') return String(a.status ?? '').localeCompare(String(b.status ?? ''));

  return Date.parse(b.createdAt ?? '0') - Date.parse(a.createdAt ?? '0');
};

const highlightText = (text: string, search: string) => {
  if (!search || !text.includes(search)) return text;

  const [before, after] = text.split(search);

  return (
    <>
      {before}
      <mark>{search}</mark>
      {after}
    </>
  );
};

const statusLabel = (status: TaskStatus | undefined) => {
  if (status === 'completed') return '已完成';
  if (status === 'running') return '生成中';
  if (status === 'failed') return '失败';
  return '排队中';
};

const statusStyle = (status: TaskStatus | undefined): React.CSSProperties => ({
  alignSelf: 'start',
  background: status === 'completed' ? '#DCFCE7' : status === 'failed' ? '#FEE2E2' : '#FEF3C7',
  borderRadius: designTokens.radii.full,
  color: status === 'completed' ? designTokens.colors.success : status === 'failed' ? designTokens.colors.danger : designTokens.colors.warning,
  fontSize: '12px',
  fontWeight: designTokens.typography.weightBold,
  justifySelf: 'start',
  padding: `${designTokens.spacing[1]} ${designTokens.spacing[2]}`
});

const gridStyle = {
  display: 'grid',
  gap: designTokens.spacing[4],
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
};

const linkStyle = {
  color: 'inherit',
  textDecoration: 'none'
};
