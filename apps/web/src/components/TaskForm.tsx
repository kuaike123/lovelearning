'use client';

import React, {FormEvent, useEffect, useState} from 'react';

import {designTokens} from '../styles/tokens';
import {Button} from './Button';
import {Card} from './Card';
import {FormPreview} from './FormPreview';
import {Input} from './Input';

type TaskFormValues = {
  content: string;
  outputType: string;
  subject: string;
  targetDurationSec: number;
  taskName?: string;
};

type TaskFormProps = {
  initialContent?: string;
  initialTargetDurationSec?: 30 | 45 | 60;
  initialTaskName?: string;
  onSubmit?: (values: TaskFormValues) => void | Promise<void>;
};

const draftKey = 'lovelearning.task-form.draft';

export function TaskForm({
  initialContent = '',
  initialTargetDurationSec = 45,
  initialTaskName = '',
  onSubmit
}: TaskFormProps) {
  const [content, setContent] = useState(initialContent);
  const [taskName, setTaskName] = useState(initialTaskName);
  const [subject, setSubject] = useState('数学');
  const [outputType, setOutputType] = useState('讲解视频');
  const [targetDurationSec, setTargetDurationSec] = useState(initialTargetDurationSec);
  const trimmedContent = content.trim();
  const trimmedTaskName = taskName.trim();
  const contentError = trimmedContent ? undefined : '题目内容不能为空';

  useEffect(() => {
    const savedDraft = window.localStorage.getItem(draftKey);

    if (!initialContent && savedDraft) {
      setContent(savedDraft);
    }
  }, [initialContent]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      window.localStorage.setItem(draftKey, content);
    }, 30_000);

    return () => window.clearInterval(timer);
  }, [content]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedContent) {
      return;
    }

    void onSubmit?.({
      content: trimmedContent,
      outputType,
      subject,
      targetDurationSec,
      ...(trimmedTaskName ? {taskName: trimmedTaskName} : {})
    });
  };

  return (
    <form
      data-draft-interval-ms="30000"
      data-task-form="three-step-flow"
      data-validation-feedback-ms="200"
      onSubmit={handleSubmit}
      style={taskFormStyle}
    >
      <div style={formColumnStyle}>
        <Card data-task-form-step="content" elevation="low" header="1. 输入内容">
          <div style={contentFieldsStyle}>
            <Input
              id="task-name"
              label="任务名称"
              name="taskName"
              onChange={(event) => setTaskName(event.target.value)}
              placeholder="例如：初一方程标准讲解"
              value={taskName}
            />
            <label htmlFor="task-content" style={textareaLabelStyle}>
              题目内容
            </label>
            <textarea
              aria-describedby={contentError ? 'task-content-error' : 'task-content-help'}
              aria-invalid={contentError ? true : undefined}
              id="task-content"
              name="content"
              onChange={(event) => setContent(event.target.value)}
              placeholder="请输入题目内容"
              style={{
                ...textareaStyle,
                border: `1px solid ${contentError ? designTokens.colors.danger : designTokens.colors.border}`
              }}
              value={content}
            />
            <p
              id={contentError ? 'task-content-error' : 'task-content-help'}
              role={contentError ? 'alert' : undefined}
              style={{
                color: contentError ? designTokens.colors.danger : designTokens.colors.neutral600,
                fontSize: designTokens.typography.sizeSm,
                lineHeight: designTokens.typography.lineNormal,
                margin: 0
              }}
            >
              {contentError ?? '输入一道题目或一个知识点，系统会自动推荐生成配置。'}
            </p>
          </div>
        </Card>

        <Card data-task-form-step="settings" elevation="low" header="2. 生成设置">
          <div style={settingsGridStyle}>
            <label style={fieldStyle}>
              学科
              <select onChange={(event) => setSubject(event.target.value)} style={selectStyle} value={subject}>
                <option value="数学">数学</option>
                <option value="语文">语文</option>
                <option value="英语">英语</option>
                <option value="物理">物理</option>
              </select>
            </label>
            <label style={fieldStyle}>
              输出类型
              <select onChange={(event) => setOutputType(event.target.value)} style={selectStyle} value={outputType}>
                <option value="讲解视频">讲解视频</option>
                <option value="PPT">PPT</option>
                <option value="教案">教案</option>
                <option value="试卷">试卷</option>
              </select>
            </label>
            <label style={fieldStyle}>
              目标时长
              <select
                onChange={(event) => setTargetDurationSec(Number(event.target.value) as 30 | 45 | 60)}
                style={selectStyle}
                value={targetDurationSec}
              >
                <option value={30}>30 秒</option>
                <option value={45}>45 秒</option>
                <option value={60}>60 秒</option>
              </select>
            </label>
          </div>
          <details data-task-form-advanced="collapsed" style={{marginTop: designTokens.spacing[4]}}>
            <summary style={{cursor: 'pointer', fontWeight: designTokens.typography.weightBold}}>
              高级选项
            </summary>
          </details>
        </Card>

        <Card
          data-task-form-step="review"
          elevation="low"
          footer={
            <Button disabled={!trimmedContent} type="submit" variant="primary">
              创建任务
            </Button>
          }
          header="3. 确认提交"
        >
          <p style={{color: designTokens.colors.neutral600, margin: 0}}>
            系统将按当前配置生成内容，提交后可在历史任务中查看进度。
          </p>
        </Card>
      </div>
      <FormPreview
        content={content}
        outputType={outputType}
        subject={subject}
        targetDurationSec={targetDurationSec}
      />
    </form>
  );
}

const taskFormStyle = {
  display: 'grid',
  gap: designTokens.spacing[5],
  gridTemplateColumns: 'minmax(0, 1fr) minmax(260px, 340px)'
};

const formColumnStyle = {
  display: 'grid',
  gap: designTokens.spacing[4]
};

const contentFieldsStyle = {
  display: 'grid',
  gap: designTokens.spacing[3]
};

const settingsGridStyle = {
  display: 'grid',
  gap: designTokens.spacing[4],
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))'
};

const fieldStyle = {
  color: designTokens.colors.neutral700,
  display: 'grid',
  fontSize: designTokens.typography.sizeSm,
  fontWeight: designTokens.typography.weightBold,
  gap: designTokens.spacing[2]
};

const textareaLabelStyle = {
  color: designTokens.colors.neutral900,
  fontSize: designTokens.typography.sizeSm,
  fontWeight: designTokens.typography.weightBold
};

const controlBaseStyle = {
  background: designTokens.colors.surface,
  border: `1px solid ${designTokens.colors.border}`,
  borderRadius: designTokens.radii.md,
  color: designTokens.colors.neutral900,
  font: 'inherit',
  minHeight: '44px',
  padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
  width: '100%'
};

const selectStyle = {
  ...controlBaseStyle
};

const textareaStyle = {
  ...controlBaseStyle,
  minHeight: '132px',
  resize: 'vertical' as const
};
