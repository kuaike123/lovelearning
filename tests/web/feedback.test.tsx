import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';

import {ErrorMessage} from '../../apps/web/src/components/ErrorMessage';
import {LoadingState} from '../../apps/web/src/components/LoadingState';
import {SuccessMessage} from '../../apps/web/src/components/SuccessMessage';
import {withRetry} from '../../apps/web/src/lib/api-client';

describe('feedback components', () => {
  it('renders plain-language errors with an actionable retry control', () => {
    const html = renderToStaticMarkup(
      <ErrorMessage
        message="生成服务暂时无法连接"
        onRetry={() => undefined}
        suggestion="请确认本地 API 已启动，然后重试。"
      />
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain('生成服务暂时无法连接');
    expect(html).toContain('请确认本地 API 已启动，然后重试。');
    expect(html).toContain('重试');
    expect(html).not.toContain('stack');
    expect(html).not.toContain('TypeError');
  });

  it('renders success messages with a 3-5 second auto-dismiss contract', () => {
    const html = renderToStaticMarkup(<SuccessMessage message="任务已创建" />);

    expect(html).toContain('role="status"');
    expect(html).toContain('data-auto-dismiss-ms="4000"');
    expect(html).toContain('任务已创建');
  });

  it('renders loading feedback for in-flight actions', () => {
    const html = renderToStaticMarkup(<LoadingState label="正在生成" />);

    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('正在生成');
    expect(html).toContain('data-loading-feedback="action"');
  });
});

describe('withRetry', () => {
  it('retries a failed network operation before returning success', async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new Error('API_UNREACHABLE'))
      .mockResolvedValueOnce({ok: true});

    await expect(withRetry(operation, {retries: 1})).resolves.toEqual({ok: true});
    expect(operation).toHaveBeenCalledTimes(2);
  });
});
