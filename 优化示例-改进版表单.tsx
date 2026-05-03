/**
 * 改进版表单组件示例
 * 展示如何应用新的设计系统和交互模式
 */

'use client';

import React, {useState, useEffect} from 'react';
import {createButtonStyle, createCardStyle, createInputStyle, createLabelStyle, createBadgeStyle, designTokens} from './ui-primitives-v2';

type FormStep = 'content' | 'settings' | 'voice' | 'review';

export function ImprovedSubmitJobForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>('content');
  const [content, setContent] = useState('');
  const [taskName, setTaskName] = useState('');
  const [isValid, setIsValid] = useState(false);
  
  // 自动验证
  useEffect(() => {
    setIsValid(content.trim().length > 0 && taskName.trim().length > 0);
  }, [content, taskName]);
  
  return (
    <div style={formContainerStyle}>
      {/* 进度指示器 */}
      <StepIndicator currentStep={currentStep} />
      
      {/* 主表单区域 */}
      <div style={formMainStyle}>
        <div style={formContentStyle}>
          {currentStep === 'content' && (
            <ContentStep
              content={content}
              taskName={taskName}
              onContentChange={setContent}
              onTaskNameChange={setTaskName}
            />
          )}
          
          {currentStep === 'settings' && <SettingsStep />}
          {currentStep === 'voice' && <VoiceStep />}
          {currentStep === 'review' && <ReviewStep />}
        </div>
        
        {/* 侧边栏 - 实时预览 */}
        <aside style={sidebarStyle}>
          <LivePreview
            content={content}
            taskName={taskName}
            isValid={isValid}
          />
        </aside>
      </div>
      
      {/* 底部操作栏 */}
      <FormActions
        currentStep={currentStep}
        isValid={isValid}
        onNext={() => {/* 下一步逻辑 */}}
        onBack={() => {/* 返回逻辑 */}}
      />
    </div>
  );
}

// ============================================================================
// 步骤指示器
// ============================================================================

function StepIndicator({currentStep}: {currentStep: FormStep}) {
  const steps: {id: FormStep; label: string; icon: string}[] = [
    {id: 'content', label: '输入题目', icon: '📝'},
    {id: 'settings', label: '生成设置', icon: '⚙️'},
    {id: 'voice', label: '配音选择', icon: '🎤'},
    {id: 'review', label: '确认生成', icon: '✅'},
  ];
  
  const currentIndex = steps.findIndex(s => s.id === currentStep);
  
  return (
    <nav style={stepIndicatorStyle} aria-label="表单步骤">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = index < currentIndex;
        
        return (
          <div key={step.id} style={stepItemStyle}>
            <div
              style={{
                ...stepCircleStyle,
                ...(isActive ? stepCircleActiveStyle : {}),
                ...(isCompleted ? stepCircleCompletedStyle : {}),
              }}
            >
              {isCompleted ? '✓' : step.icon}
            </div>
            <span
              style={{
                ...stepLabelStyle,
                ...(isActive ? stepLabelActiveStyle : {}),
              }}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && <div style={stepConnectorStyle} />}
          </div>
        );
      })}
    </nav>
  );
}

// ============================================================================
// 内容输入步骤
// ============================================================================

function ContentStep({
  content,
  taskName,
  onContentChange,
  onTaskNameChange,
}: {
  content: string;
  taskName: string;
  onContentChange: (value: string) => void;
  onTaskNameChange: (value: string) => void;
}) {
  return (
    <div style={stepContainerStyle}>
      <header style={stepHeaderStyle}>
        <h2 style={stepTitleStyle}>输入题目内容</h2>
        <p style={stepDescriptionStyle}>
          请输入需要讲解的数学题目,系统会自动分析并生成讲解步骤
        </p>
      </header>
      
      <div style={fieldGroupStyle}>
        <label htmlFor="taskName" style={createLabelStyle()}>
          任务名称 <span style={requiredMarkStyle}>*</span>
        </label>
        <input
          id="taskName"
          type="text"
          placeholder="例如:初一方程例题讲解"
          value={taskName}
          onChange={(e) => onTaskNameChange(e.target.value)}
          style={{
            ...createInputStyle(),
            ...(taskName.trim().length > 0 ? inputValidStyle : {}),
          }}
          aria-required="true"
        />
        <span style={fieldHintStyle}>
          用于在任务列表中识别这个视频
        </span>
      </div>
      
      <div style={fieldGroupStyle}>
        <label htmlFor="content" style={createLabelStyle()}>
          题目内容 <span style={requiredMarkStyle}>*</span>
        </label>
        <textarea
          id="content"
          placeholder="例如:解方程: 2x + 3 = 11"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          style={{
            ...createInputStyle(),
            minHeight: '160px',
            resize: 'vertical' as const,
            ...(content.trim().length > 0 ? inputValidStyle : {}),
          }}
          aria-required="true"
        />
        <div style={fieldFooterStyle}>
          <span style={fieldHintStyle}>
            支持方程、应用题等多种题型
          </span>
          <span style={characterCountStyle}>
            {content.length} / 500
          </span>
        </div>
      </div>
      
      {/* 智能提示 */}
      {content.length > 10 && (
        <div style={smartTipStyle}>
          <span style={smartTipIconStyle}>💡</span>
          <div>
            <strong style={smartTipTitleStyle}>智能识别</strong>
            <p style={smartTipBodyStyle}>
              检测到方程题型,推荐使用"老师讲解"风格,时长45秒
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 设置步骤
// ============================================================================

function SettingsStep() {
  return (
    <div style={stepContainerStyle}>
      <header style={stepHeaderStyle}>
        <h2 style={stepTitleStyle}>生成设置</h2>
        <p style={stepDescriptionStyle}>
          配置视频的时长、风格和适用年级
        </p>
      </header>
      
      <div style={settingsGridStyle}>
        <SettingCard
          icon="⏱️"
          label="目标时长"
          value="45秒"
          description="适合短视频平台"
          recommended
        />
        <SettingCard
          icon="🎨"
          label="讲解风格"
          value="老师讲解"
          description="标准教学风格"
        />
        <SettingCard
          icon="🎓"
          label="适用年级"
          value="初中"
          description="初一至初三"
        />
      </div>
    </div>
  );
}

function SettingCard({
  icon,
  label,
  value,
  description,
  recommended,
}: {
  icon: string;
  label: string;
  value: string;
  description: string;
  recommended?: boolean;
}) {
  return (
    <button type="button" style={settingCardStyle}>
      {recommended && (
        <span style={createBadgeStyle('success')}>推荐</span>
      )}
      <div style={settingCardIconStyle}>{icon}</div>
      <div style={settingCardContentStyle}>
        <span style={settingCardLabelStyle}>{label}</span>
        <strong style={settingCardValueStyle}>{value}</strong>
        <span style={settingCardDescStyle}>{description}</span>
      </div>
    </button>
  );
}

// ============================================================================
// 配音步骤
// ============================================================================

function VoiceStep() {
  return (
    <div style={stepContainerStyle}>
      <header style={stepHeaderStyle}>
        <h2 style={stepTitleStyle}>选择配音</h2>
        <p style={stepDescriptionStyle}>
          试听不同音色,选择最适合这道题的老师声音
        </p>
      </header>
      
      {/* 推荐音色 */}
      <div style={recommendationBannerStyle}>
        <div style={recommendationHeaderStyle}>
          <span style={recommendationIconStyle}>⭐</span>
          <div>
            <strong style={recommendationTitleStyle}>推荐音色</strong>
            <p style={recommendationBodyStyle}>
              根据题目类型和风格,推荐使用"温柔女声 + 正常语速"
            </p>
          </div>
        </div>
        <button
          type="button"
          style={createButtonStyle('primary', 'sm')}
        >
          采用推荐
        </button>
      </div>
      
      {/* 音色选项 */}
      <div style={voiceGridStyle}>
        <VoiceCard
          name="温柔女声"
          description="亲切自然,适合基础讲解"
          audioUrl="/samples/voice-1.mp3"
          recommended
        />
        <VoiceCard
          name="清晰女声"
          description="发音标准,适合重点强调"
          audioUrl="/samples/voice-2.mp3"
        />
        <VoiceCard
          name="沉稳男声"
          description="稳重专业,适合难题讲解"
          audioUrl="/samples/voice-3.mp3"
        />
      </div>
    </div>
  );
}

function VoiceCard({
  name,
  description,
  audioUrl,
  recommended,
}: {
  name: string;
  description: string;
  audioUrl: string;
  recommended?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div style={voiceCardStyle}>
      {recommended && (
        <span style={createBadgeStyle('success')}>推荐</span>
      )}
      <div style={voiceCardHeaderStyle}>
        <div>
          <strong style={voiceCardNameStyle}>{name}</strong>
          <p style={voiceCardDescStyle}>{description}</p>
        </div>
        <button
          type="button"
          style={playButtonStyle}
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? '暂停' : '播放'}
        >
          {isPlaying ? '⏸' : '▶️'}
        </button>
      </div>
      <audio src={audioUrl} controls style={audioPlayerStyle} />
    </div>
  );
}

// ============================================================================
// 确认步骤
// ============================================================================

function ReviewStep() {
  return (
    <div style={stepContainerStyle}>
      <header style={stepHeaderStyle}>
        <h2 style={stepTitleStyle}>确认生成</h2>
        <p style={stepDescriptionStyle}>
          请检查以下信息,确认无误后开始生成视频
        </p>
      </header>
      
      <div style={reviewSummaryStyle}>
        <ReviewItem label="任务名称" value="初一方程例题讲解" />
        <ReviewItem label="题目内容" value="解方程: 2x + 3 = 11" />
        <ReviewItem label="目标时长" value="45秒" />
        <ReviewItem label="讲解风格" value="老师讲解" />
        <ReviewItem label="配音音色" value="温柔女声" />
        <ReviewItem label="语速" value="正常" />
      </div>
      
      <div style={estimateCardStyle}>
        <span style={estimateIconStyle}>⏱️</span>
        <div>
          <strong style={estimateTitleStyle}>预计生成时间</strong>
          <p style={estimateBodyStyle}>
            约 2-3 分钟,生成完成后会自动通知您
          </p>
        </div>
      </div>
    </div>
  );
}

function ReviewItem({label, value}: {label: string; value: string}) {
  return (
    <div style={reviewItemStyle}>
      <span style={reviewItemLabelStyle}>{label}</span>
      <strong style={reviewItemValueStyle}>{value}</strong>
    </div>
  );
}

// ============================================================================
// 实时预览侧边栏
// ============================================================================

function LivePreview({
  content,
  taskName,
  isValid,
}: {
  content: string;
  taskName: string;
  isValid: boolean;
}) {
  return (
    <div style={previewCardStyle}>
      <h3 style={previewTitleStyle}>实时预览</h3>
      
      <div style={previewContentStyle}>
        <div style={previewItemStyle}>
          <span style={previewLabelStyle}>任务名称</span>
          <span style={previewValueStyle}>
            {taskName || '未填写'}
          </span>
        </div>
        
        <div style={previewItemStyle}>
          <span style={previewLabelStyle}>题目内容</span>
          <span style={previewValueStyle}>
            {content || '未填写'}
          </span>
        </div>
        
        <div style={previewItemStyle}>
          <span style={previewLabelStyle}>预计产出</span>
          <span style={previewValueStyle}>
            45秒竖屏视频 + 字幕 + 配音
          </span>
        </div>
      </div>
      
      <div style={previewStatusStyle}>
        <div style={statusIndicatorStyle}>
          <span
            style={{
              ...statusDotStyle,
              background: isValid
                ? designTokens.colors.success.main
                : designTokens.colors.neutral[300],
            }}
          />
          <span style={statusTextStyle}>
            {isValid ? '准备就绪' : '请完善必填信息'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 表单操作栏
// ============================================================================

function FormActions({
  currentStep,
  isValid,
  onNext,
  onBack,
}: {
  currentStep: FormStep;
  isValid: boolean;
  onNext: () => void;
  onBack: () => void;
}) {
  const isFirstStep = currentStep === 'content';
  const isLastStep = currentStep === 'review';
  
  return (
    <div style={actionsBarStyle}>
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep}
        style={{
          ...createButtonStyle('outline', 'lg'),
          ...(isFirstStep ? {opacity: 0.5, cursor: 'not-allowed'} : {}),
        }}
      >
        上一步
      </button>
      
      <button
        type="button"
        onClick={onNext}
        disabled={!isValid}
        style={{
          ...createButtonStyle('primary', 'lg'),
          ...(!isValid ? {opacity: 0.5, cursor: 'not-allowed'} : {}),
        }}
      >
        {isLastStep ? '开始生成' : '下一步'}
      </button>
    </div>
  );
}

// ============================================================================
// 样式定义
// ============================================================================

const formContainerStyle: React.CSSProperties = {
  display: 'grid',
  gap: designTokens.spacing[6],
  maxWidth: '1400px',
  margin: '0 auto',
};

const formMainStyle: React.CSSProperties = {
  display: 'grid',
  gap: designTokens.spacing[6],
  gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
  alignItems: 'start',
};

const formContentStyle: React.CSSProperties = {
  ...createCardStyle('medium'),
  padding: designTokens.spacing[8],
};

const sidebarStyle: React.CSSProperties = {
  position: 'sticky' as const,
  top: designTokens.spacing[6],
};

const stepIndicatorStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: designTokens.spacing[2],
  padding: designTokens.spacing[6],
  background: designTokens.colors.background.primary,
  borderRadius: designTokens.borderRadius.xl,
  boxShadow: designTokens.shadows.sm,
};

const stepItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: designTokens.spacing[3],
  flex: 1,
  position: 'relative' as const,
};

const stepCircleStyle: React.CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: designTokens.borderRadius.full,
  background: designTokens.colors.neutral[100],
  color: designTokens.colors.neutral[500],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: designTokens.fontSize.xl,
  fontWeight: designTokens.fontWeight.semibold,
  transition: `all ${designTokens.transitions.base}`,
};

const stepCircleActiveStyle: React.CSSProperties = {
  background: designTokens.colors.brand.primary,
  color: '#FFFFFF',
  boxShadow: `0 0 0 4px ${designTokens.colors.brand.primary}20`,
};

const stepCircleCompletedStyle: React.CSSProperties = {
  background: designTokens.colors.success.main,
  color: '#FFFFFF',
};

const stepLabelStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.sm,
  fontWeight: designTokens.fontWeight.medium,
  color: designTokens.colors.neutral[600],
};

const stepLabelActiveStyle: React.CSSProperties = {
  color: designTokens.colors.neutral[900],
  fontWeight: designTokens.fontWeight.semibold,
};

const stepConnectorStyle: React.CSSProperties = {
  flex: 1,
  height: '2px',
  background: designTokens.colors.neutral[200],
  marginLeft: designTokens.spacing[3],
};

const stepContainerStyle: React.CSSProperties = {
  display: 'grid',
  gap: designTokens.spacing[6],
};

const stepHeaderStyle: React.CSSProperties = {
  display: 'grid',
  gap: designTokens.spacing[2],
};

const stepTitleStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize['3xl'],
  fontWeight: designTokens.fontWeight.bold,
  color: designTokens.colors.neutral[900],
  margin: 0,
};

const stepDescriptionStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.lg,
  color: designTokens.colors.neutral[600],
  lineHeight: designTokens.lineHeight.relaxed,
  margin: 0,
};

const fieldGroupStyle: React.CSSProperties = {
  display: 'grid',
  gap: designTokens.spacing[2],
};

const requiredMarkStyle: React.CSSProperties = {
  color: designTokens.colors.error.main,
};

const fieldHintStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.sm,
  color: designTokens.colors.neutral[500],
};

const fieldFooterStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const characterCountStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.sm,
  color: designTokens.colors.neutral[400],
  fontWeight: designTokens.fontWeight.medium,
};

const inputValidStyle: React.CSSProperties = {
  borderColor: designTokens.colors.success.main,
  boxShadow: `0 0 0 3px ${designTokens.colors.success.main}10`,
};

const smartTipStyle: React.CSSProperties = {
  ...createCardStyle('flat'),
  background: designTokens.colors.info.bg,
  borderColor: designTokens.colors.info.light,
  display: 'flex',
  gap: designTokens.spacing[3],
  padding: designTokens.spacing[4],
};

const smartTipIconStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize['2xl'],
};

const smartTipTitleStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.base,
  color: designTokens.colors.info.dark,
  display: 'block',
  marginBottom: designTokens.spacing[1],
};

const smartTipBodyStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.sm,
  color: designTokens.colors.info.dark,
  margin: 0,
  lineHeight: designTokens.lineHeight.relaxed,
};

const settingsGridStyle: React.CSSProperties = {
  display: 'grid',
  gap: designTokens.spacing[4],
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
};

const settingCardStyle: React.CSSProperties = {
  ...createCardStyle('flat'),
  cursor: 'pointer',
  textAlign: 'left' as const,
  transition: `all ${designTokens.transitions.base}`,
  border: `2px solid ${designTokens.colors.neutral[200]}`,
  position: 'relative' as const,
};

const settingCardIconStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize['4xl'],
  marginBottom: designTokens.spacing[3],
};

const settingCardContentStyle: React.CSSProperties = {
  display: 'grid',
  gap: designTokens.spacing[1],
};

const settingCardLabelStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.sm,
  color: designTokens.colors.neutral[600],
  fontWeight: designTokens.fontWeight.medium,
};

const settingCardValueStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.xl,
  color: designTokens.colors.neutral[900],
};

const settingCardDescStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.sm,
  color: designTokens.colors.neutral[500],
};

const recommendationBannerStyle: React.CSSProperties = {
  ...createCardStyle('flat'),
  background: designTokens.colors.success.bg,
  borderColor: designTokens.colors.success.light,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: designTokens.spacing[5],
};

const recommendationHeaderStyle: React.CSSProperties = {
  display: 'flex',
  gap: designTokens.spacing[3],
  alignItems: 'start',
};

const recommendationIconStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize['2xl'],
};

const recommendationTitleStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.lg,
  color: designTokens.colors.success.dark,
  display: 'block',
  marginBottom: designTokens.spacing[1],
};

const recommendationBodyStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.sm,
  color: designTokens.colors.success.dark,
  margin: 0,
  lineHeight: designTokens.lineHeight.relaxed,
};

const voiceGridStyle: React.CSSProperties = {
  display: 'grid',
  gap: designTokens.spacing[4],
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
};

const voiceCardStyle: React.CSSProperties = {
  ...createCardStyle('flat'),
  border: `2px solid ${designTokens.colors.neutral[200]}`,
  position: 'relative' as const,
};

const voiceCardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'start',
  marginBottom: designTokens.spacing[3],
};

const voiceCardNameStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.lg,
  color: designTokens.colors.neutral[900],
  display: 'block',
  marginBottom: designTokens.spacing[1],
};

const voiceCardDescStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.sm,
  color: designTokens.colors.neutral[600],
  margin: 0,
};

const playButtonStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: designTokens.borderRadius.full,
  background: designTokens.colors.brand.primary,
  color: '#FFFFFF',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: designTokens.fontSize.lg,
};

const audioPlayerStyle: React.CSSProperties = {
  width: '100%',
};

const reviewSummaryStyle: React.CSSProperties = {
  ...createCardStyle('flat'),
  background: designTokens.colors.background.secondary,
  gap: designTokens.spacing[3],
};

const reviewItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${designTokens.spacing[3]} 0`,
  borderBottom: `1px solid ${designTokens.colors.neutral[200]}`,
};

const reviewItemLabelStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.base,
  color: designTokens.colors.neutral[600],
};

const reviewItemValueStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.base,
  color: designTokens.colors.neutral[900],
};

const estimateCardStyle: React.CSSProperties = {
  ...createCardStyle('flat'),
  background: designTokens.colors.info.bg,
  borderColor: designTokens.colors.info.light,
  display: 'flex',
  gap: designTokens.spacing[3],
  alignItems: 'start',
};

const estimateIconStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize['2xl'],
};

const estimateTitleStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.lg,
  color: designTokens.colors.info.dark,
  display: 'block',
  marginBottom: designTokens.spacing[1],
};

const estimateBodyStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.base,
  color: designTokens.colors.info.dark,
  margin: 0,
  lineHeight: designTokens.lineHeight.relaxed,
};

const previewCardStyle: React.CSSProperties = {
  ...createCardStyle('medium'),
  position: 'sticky' as const,
  top: designTokens.spacing[6],
};

const previewTitleStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.xl,
  fontWeight: designTokens.fontWeight.semibold,
  color: designTokens.colors.neutral[900],
  margin: 0,
  marginBottom: designTokens.spacing[4],
};

const previewContentStyle: React.CSSProperties = {
  display: 'grid',
  gap: designTokens.spacing[4],
  marginBottom: designTokens.spacing[4],
};

const previewItemStyle: React.CSSProperties = {
  display: 'grid',
  gap: designTokens.spacing[1],
};

const previewLabelStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.sm,
  color: designTokens.colors.neutral[600],
  fontWeight: designTokens.fontWeight.medium,
};

const previewValueStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.base,
  color: designTokens.colors.neutral[900],
};

const previewStatusStyle: React.CSSProperties = {
  padding: `${designTokens.spacing[4]} 0`,
  borderTop: `1px solid ${designTokens.colors.neutral[200]}`,
};

const statusIndicatorStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: designTokens.spacing[2],
};

const statusDotStyle: React.CSSProperties = {
  width: '12px',
  height: '12px',
  borderRadius: designTokens.borderRadius.full,
};

const statusTextStyle: React.CSSProperties = {
  fontSize: designTokens.fontSize.sm,
  color: designTokens.colors.neutral[700],
  fontWeight: designTokens.fontWeight.medium,
};

const actionsBarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: designTokens.spacing[4],
  padding: designTokens.spacing[6],
  background: designTokens.colors.background.primary,
  borderRadius: designTokens.borderRadius.xl,
  boxShadow: designTokens.shadows.lg,
  position: 'sticky' as const,
  bottom: designTokens.spacing[6],
};
