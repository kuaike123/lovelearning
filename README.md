# LoveLearning

LoveLearning 是一个面向教育场景的 AI 讲解视频生成工作台。项目支持输入数学、物理等题目，自动规划讲解步骤，生成可渲染的教学场景，并通过 Remotion 输出视频素材。

## 功能概览

- 题目解析与课程规划：将题目拆解为知识点、讲解步骤和可视化场景。
- 教学视频渲染：基于 Remotion 组件生成讲解画面、字幕、音频和视频产物。
- Web 工作台：提供题目输入、样例浏览、任务结果查看等交互界面。
- API 服务：负责任务创建、渲染调度、产物访问和本地 artifact 托管。
- TTS 适配层：支持 mock、placeholder、Windows SAPI 等语音合成模式。
- 教材导入工具：将本地教材 PDF 数据整理为后续 RAG 使用的 Markdown 语料。

## 技术栈

- Monorepo：pnpm workspace
- 前端：Next.js 15、React 19
- 后端：NestJS、tsx
- 渲染：Remotion
- 测试：Vitest
- 类型校验：TypeScript

## 目录结构

```text
apps/
  api/                 API 服务与 artifact 静态访问
  web/                 Next.js Web 工作台
packages/
  job-runner/          任务运行与渲染编排
  lesson-engine/       题目解析、课程规划和模板
  renderer/            Remotion 场景渲染组件
  shared-types/        跨包共享类型
  tts-service/         TTS provider 抽象与实现
tests/                 单元测试与集成测试
tools/textbook-ingest/ 教材导入流水线脚本
docs/                  设计文档与使用说明
```

## 环境要求

- Node.js 20+
- pnpm 10+
- Windows SAPI 可选，仅在使用 `windows_sapi` TTS provider 时需要
- Python 与 Java 11+ 可选，仅在运行教材导入流水线时需要

## 快速开始

安装依赖：

```powershell
pnpm install
```

启动 API 服务：

```powershell
pnpm dev:api
```

启动 Web 工作台：

```powershell
pnpm dev:web
```

默认地址：

- Web: `http://localhost:3000`
- API: `http://localhost:3001`
- Artifact: `http://localhost:3001/artifacts/...`

## 常用脚本

```powershell
pnpm test
pnpm typecheck
pnpm verify:v1
pnpm vercel-build
```

## TTS 配置

通过 `EDU_TTS_PROVIDER` 选择语音合成 provider：

```powershell
$env:EDU_TTS_PROVIDER = "placeholder"
```

可选值：

- `mock`：返回模拟音频地址，不写入真实音频文件。
- `placeholder`：生成可播放的占位 WAV，并按文案估算时长。
- `windows_sapi`：优先调用 Windows System.Speech，不可用时回退到 placeholder。

更多说明见 [docs/tts-provider-setup.md](docs/tts-provider-setup.md)。

## 教材导入

教材导入工具用于将本地教材 PDF 语料转换为 Markdown，输出到 `data/textbooks`。

推荐顺序：

```powershell
pnpm textbook:setup:python
pnpm textbook:doctor
pnpm textbook:manifest
pnpm textbook:merge
pnpm textbook:convert
pnpm textbook:verify
```

完整说明见 [docs/textbook-ingest.md](docs/textbook-ingest.md)。

## 开发校验

提交前建议至少运行：

```powershell
pnpm verify:v1
```

如果只修改文档，可以按需跳过完整测试，但应确保 Markdown 链接和命令说明与当前 `package.json` 保持一致。

## License

本项目采用 [MIT License](LICENSE) 开源。

LoveLearning 希望用技术降低优质教育内容的生产门槛，让更多人拥有学习、理解和获得教育机会的可能。
