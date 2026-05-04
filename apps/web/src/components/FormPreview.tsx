import React from 'react';

import {designTokens} from '../styles/tokens';
import {Button} from './Button';
import {Card} from './Card';

type FormPreviewProps = {
  content: string;
  outputType: string;
  subject: string;
  targetDurationSec: number;
};

export function FormPreview({content, outputType, subject, targetDurationSec}: FormPreviewProps) {
  return (
    <aside
      data-form-preview="live-summary"
      data-preview-update-ms="300"
      style={{
        position: 'sticky',
        top: designTokens.spacing[5]
      }}
    >
      <Card
        elevation="medium"
        footer={
          <Button type="button" variant="tertiary">
            隐藏预览
          </Button>
        }
        header="实时预览"
      >
        <dl style={{display: 'grid', gap: designTokens.spacing[3], margin: 0}}>
          <PreviewItem label="题目" value={content || '待输入'} />
          <PreviewItem label="学科" value={subject} />
          <PreviewItem label="输出" value={outputType} />
          <PreviewItem label="时长" value={`${targetDurationSec} 秒`} />
        </dl>
      </Card>
    </aside>
  );
}

function PreviewItem({label, value}: {label: string; value: string}) {
  return (
    <div data-preview-changed="true" style={{display: 'grid', gap: designTokens.spacing[1]}} title={`${label}配置`}>
      <dt style={{color: designTokens.colors.neutral600, fontSize: designTokens.typography.sizeSm}}>
        {label}
      </dt>
      <dd style={{color: designTokens.colors.neutral900, fontWeight: designTokens.typography.weightBold, margin: 0}}>
        {value}
      </dd>
    </div>
  );
}
