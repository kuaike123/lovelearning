import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';

import {Button} from '../../apps/web/src/components/Button';
import {designTokens} from '../../apps/web/src/styles/tokens';

describe('Button', () => {
  it('renders primary, secondary, and tertiary variants with token-based styles', () => {
    const html = renderToStaticMarkup(
      <div>
        <Button variant="primary">生成视频</Button>
        <Button variant="secondary">预览样片</Button>
        <Button variant="tertiary">取消</Button>
      </div>
    );

    expect(html).toContain('data-variant="primary"');
    expect(html).toContain('data-variant="secondary"');
    expect(html).toContain('data-variant="tertiary"');
    expect(html).toContain(`background:${designTokens.colors.primary}`);
    expect(html).toContain(`border:1px solid ${designTokens.colors.border}`);
    expect(html).toContain('min-height:44px');
    expect(html).toContain('min-width:44px');
  });

  it('marks disabled buttons as non-interactive', () => {
    const html = renderToStaticMarkup(
      <Button disabled onClick={() => undefined}>
        生成中
      </Button>
    );

    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain('cursor:not-allowed');
  });

  it('activates on Enter and Space when keyboard events are handled', () => {
    const onClick = vi.fn();
    const element = Button({children: '提交', onClick}) as React.ReactElement<{
      onKeyDown: (event: {key: string; preventDefault: () => void}) => void;
    }>;
    const preventDefault = vi.fn();

    element.props.onKeyDown({key: 'Enter', preventDefault});
    element.props.onKeyDown({key: ' ', preventDefault});

    expect(onClick).toHaveBeenCalledTimes(2);
    expect(preventDefault).toHaveBeenCalledTimes(2);
  });

  it('does not activate disabled buttons from keyboard events', () => {
    const onClick = vi.fn();
    const element = Button({children: '提交', disabled: true, onClick}) as React.ReactElement<{
      onKeyDown: (event: {key: string; preventDefault: () => void}) => void;
    }>;

    element.props.onKeyDown({key: 'Enter', preventDefault: vi.fn()});

    expect(onClick).not.toHaveBeenCalled();
  });
});
