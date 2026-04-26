import {Controller, Get, Header} from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Header('content-type', 'text/html; charset=utf-8')
  landing() {
    return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>\u6559\u80b2\u89c6\u9891\u751f\u6210 API</title>
    <style>
      body {
        background: #fbf7ef;
        color: #1f2937;
        font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
        margin: 0;
        padding: 48px;
      }
      main {
        background: #fffaf1;
        border: 1px solid #eadfca;
        border-radius: 24px;
        max-width: 760px;
        padding: 32px;
      }
      a {
        background: #1f5134;
        border-radius: 999px;
        color: #ffffff;
        display: inline-block;
        margin-top: 12px;
        padding: 10px 16px;
        text-decoration: none;
      }
      code {
        background: #f1ead9;
        border-radius: 8px;
        padding: 2px 6px;
      }
    </style>
  </head>
  <body>
    <main>
      <p>\u6559\u80b2\u89c6\u9891\u751f\u6210 API</p>
      <h1>\u8fd9\u91cc\u662f\u540e\u7aef\u670d\u52a1</h1>
      <p>\u5982\u679c\u4f60\u8981\u4f7f\u7528\u4ea7\u54c1\u754c\u9762\uff0c\u8bf7\u6253\u5f00 <code>http://localhost:3000/</code>\u3002</p>
      <p>\u5f00\u53d1\u8c03\u8bd5\u53ef\u4ee5\u8bbf\u95ee <code>/jobs</code> \u67e5\u770b\u4efb\u52a1\u63a5\u53e3\u3002</p>
      <a href="http://localhost:3000/">\u6253\u5f00\u4ea7\u54c1\u754c\u9762</a>
    </main>
  </body>
</html>`;
  }
}
