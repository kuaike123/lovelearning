import React from 'react';
import {describe, expect, it} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';

import HomePage from '../../apps/web/src/app/page';

describe('HomePage', () => {
  it('renders an empty bordered composer with model, voice and output options', async () => {
    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain('data-chat-shell="landing"');
    expect(html).toContain('data-navigation="app-shell"');
    expect(html).toContain('data-navigation-region="desktop-sidebar"');
    expect(html).toContain('data-navigation-region="mobile-bottom"');
    expect(html).toContain('data-chat-main="composer-surface"');
    expect(html).toContain('data-chat-composer="problem-input"');
    expect(html).toContain('border:2px solid #111827');
    expect(html).toContain('请输入题目内容');
    expect(html).not.toContain('>解方程：2x + 3 = 11</textarea>');
    expect(html).not.toContain('解方程：x + 1 = 2');
    expect(html).not.toContain('解方程：3x - 6 = 12');
    expect(html).not.toContain('data-chat-quick-actions="prompt-chips"');
    expect(html).not.toContain('数学题</button>');
    expect(html).not.toContain('应用题</button>');
    expect(html).not.toContain('函数题</button>');
    expect(html).not.toContain('从样片开始</button>');
    expect(html).toContain('data-chat-subject-select="subject"');
    expect(html).toContain('data-chat-video-style-select="sample-style"');
    expect(html).toContain('data-chat-model-select="model"');
    expect(html).toContain('data-chat-mic-button="voice-input"');
    expect(html).toContain('data-chat-output-options="output-types"');
    expect(html).toContain('data-chat-advanced-settings="collapsed-panel"');
    expect(html).toContain('LoveLearning AI');
    expect(html).toContain('输入题目，生成讲解视频');
    expect(html).toContain('开始生成');
    expect(html).toContain('模型');
    expect(html).toContain('标准模型');
    expect(html).toContain('深度讲解模型');
    expect(html).toContain('快速模型');
    expect(html).toContain('麦克风');
    expect(html).toContain('PPT');
    expect(html).toContain('教案');
    expect(html).toContain('试卷');
    expect(html).toContain('讲解视频');
    expect(html).toContain('当前支持：一元一次方程、数量关系');
    expect(html).toContain('视频风格');
    expect(html).toContain('option value="linear-equation-basic"');
    expect(html).toContain('option value="quantity-relation-word-problem"');
    expect(html).toContain('option value="math" selected=""');
    expect(html).toContain('option value="physics"');
    expect(html).toContain('option value="english"');
    expect(html).toContain('grid-template-columns:220px minmax(0, 1fr)');
    expect(html).not.toContain('data-saas-shell="home-workspace"');
    expect(html).not.toContain('data-home-motion="panel-hero"');
    expect(html).not.toContain('PRODUCT BETA');
    expect(html).not.toContain('最近生成趋势');
    expect(html).not.toContain('题型覆盖');
  });

  it('renders a pure text sidebar without subject planning as a navigation item', async () => {
    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain('新建会话');
    expect(html).toContain('历史任务');
    expect(html).toContain('样片库');
    expect(html).toContain('课程素材');
    expect(html).not.toContain('学科规划');
    expect(html).not.toContain('href="/?view=roadmap"');
    expect(html).toContain('最近任务');
    expect(html).toContain('初一方程讲解');
    expect(html).toContain('应用题样片');
    expect(html).toContain('函数基础题');
    expect(html).not.toContain('点击进入');
    expect(html).not.toContain('当前工作区');
    expect(html).not.toContain('固定项目栏');
  });

  it('uses query params to prefill the central composer and advanced settings', async () => {
    const html = renderToStaticMarkup(
      await HomePage({
        searchParams: Promise.resolve({
          content: 'Solve equation: 2x + 3 = 11',
          style: 'exam',
          targetDurationSec: '60',
          voice: 'female_clear',
          speechRate: 'fast'
        })
      })
    );

    expect(html).toContain('Solve equation: 2x + 3 = 11');
    expect(html).toContain('option value="exam" selected=""');
    expect(html).toContain('option value="60" selected=""');
    expect(html).toContain('option value="female_clear" selected=""');
    expect(html).toContain('option value="fast" selected=""');
  });

  it('uses sampleStyle query params to prefill video style and sample defaults', async () => {
    const html = renderToStaticMarkup(
      await HomePage({
        searchParams: Promise.resolve({
          sampleStyle: 'quantity-relation-word-problem'
        } as never)
      })
    );

    expect(html).toContain('option value="quantity-relation-word-problem" selected=""');
    expect(html).toContain('option value="exam" selected=""');
    expect(html).toContain('option value="60" selected=""');
    expect(html).toContain('option value="fast" selected=""');
  });

  it('switches sidebar destinations inside the same minimal chat shell', async () => {
    const samplesHtml = renderToStaticMarkup(
      await HomePage({searchParams: Promise.resolve({view: 'samples'} as never)})
    );
    const jobsHtml = renderToStaticMarkup(
      await HomePage({searchParams: Promise.resolve({view: 'jobs'} as never)})
    );
    const materialsHtml = renderToStaticMarkup(
      await HomePage({searchParams: Promise.resolve({view: 'materials'} as never)})
    );

    expect(samplesHtml).toContain('data-chat-panel="samples"');
    expect(samplesHtml).toContain('样片库');
    expect(samplesHtml).toContain('一元一次方程');
    expect(samplesHtml).toContain('data-chat-sample-preset="linear-equation-basic"');
    expect(samplesHtml).toContain('href="/?view=create&amp;sampleStyle=linear-equation-basic');
    expect(samplesHtml).not.toContain('data-chat-composer="problem-input"');

    expect(jobsHtml).toContain('data-chat-panel="jobs"');
    expect(jobsHtml).toContain('data-chat-jobs-list="history"');
    expect(jobsHtml).toContain('历史任务');
    expect(jobsHtml).toContain('正在加载任务');
    expect(jobsHtml).toContain('初一方程讲解');
    expect(jobsHtml).not.toContain('已生成');

    expect(materialsHtml).toContain('data-chat-panel="materials"');
    expect(materialsHtml).toContain('课程素材');
    expect(materialsHtml).toContain('OCR');

    expect(samplesHtml).toContain('href="/?view=jobs"');
    expect(samplesHtml).toContain('href="/?view=samples"');
    expect(samplesHtml).toContain('href="/?view=materials"');
    expect(samplesHtml).not.toContain('href="/?view=roadmap"');
    expect(samplesHtml).not.toContain('data-saas-shell="home-workspace"');
  });
});
