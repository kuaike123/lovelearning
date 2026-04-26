import React from 'react';
import {describe, expect, it} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';

import HomePage from '../../apps/web/src/app/page';

describe('HomePage', () => {
  it('shows the problem input form', () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain('数学讲解视频生成器');
    expect(html).toContain('题目内容');
    expect(html).toContain('解方程：2x + 3 = 11');
    expect(html).toContain('生成视频');
  });
});
