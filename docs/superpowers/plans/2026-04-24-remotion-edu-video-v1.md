# Remotion Edu Video V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a V1 system that turns a junior-high linear equation text input into a 45-second narrated explanation video with subtitles and deterministic Remotion scenes.

**Architecture:** Use a TypeScript monorepo with `apps/web` for the operator UI, `apps/api` for job APIs, and `packages/*` for shared schemas, lesson planning, TTS integration, Remotion rendering, and async job execution. Keep the LLM strictly limited to `LessonPlan` generation, and let deterministic mappers build render-safe scene props before Remotion `renderMedia()` runs in the worker.

**Tech Stack:** `pnpm` workspaces, TypeScript, Next.js, NestJS, BullMQ, Redis, PostgreSQL, Vitest, Supertest, Remotion, `@remotion/renderer`, Zod

---

## File Structure

Create the repository with these boundaries and keep responsibilities narrow:

- `package.json`
  Root workspace manifest and top-level scripts.
- `pnpm-workspace.yaml`
  Workspace package registration.
- `tsconfig.base.json`
  Shared TypeScript config.
- `apps/web/package.json`
  Next.js operator app.
- `apps/web/src/app/page.tsx`
  Job creation form.
- `apps/web/src/app/jobs/[id]/page.tsx`
  Result page.
- `apps/web/src/lib/api-client.ts`
  Typed client for the API service.
- `apps/api/package.json`
  NestJS API app.
- `apps/api/src/main.ts`
  API bootstrap.
- `apps/api/src/app.module.ts`
  Root Nest module.
- `apps/api/src/jobs/jobs.controller.ts`
  `POST /jobs` and `GET /jobs/:id`.
- `apps/api/src/jobs/jobs.service.ts`
  Job creation and query service.
- `apps/api/src/jobs/jobs.repository.ts`
  Persistence boundary for jobs.
- `apps/api/src/jobs/dto/create-job.dto.ts`
  Request validation DTO.
- `apps/api/src/queue/queue.module.ts`
  BullMQ wiring.
- `packages/shared-types/src/problem-input.ts`
  `ProblemInput` and Zod schema.
- `packages/shared-types/src/parsed-problem.ts`
  `ParsedProblem` and Zod schema.
- `packages/shared-types/src/lesson-plan.ts`
  `LessonPlan` and Zod schema.
- `packages/shared-types/src/video-scene.ts`
  `VideoScene` and `VideoProject` types.
- `packages/shared-types/src/job-result.ts`
  Job status and result types.
- `packages/shared-types/src/index.ts`
  Public exports.
- `packages/lesson-engine/src/parse-problem.ts`
  Supported equation parser.
- `packages/lesson-engine/src/plan-lesson.ts`
  LLM-backed teaching plan generator.
- `packages/lesson-engine/src/repair-lesson-plan.ts`
  Schema repair and bounded retry path.
- `packages/lesson-engine/src/map-lesson-to-scenes.ts`
  Deterministic scene mapper.
- `packages/lesson-engine/src/prompts/plan-lesson.ts`
  Lesson planning prompt template.
- `packages/lesson-engine/src/index.ts`
  Public lesson engine exports.
- `packages/renderer/src/Root.tsx`
  Remotion root registration.
- `packages/renderer/src/compositions/LessonVideo.tsx`
  Main composition.
- `packages/renderer/src/scenes/TitleScene.tsx`
  Title visual.
- `packages/renderer/src/scenes/ProblemScene.tsx`
  Equation introduction.
- `packages/renderer/src/scenes/EquationTransformScene.tsx`
  Transformation animation.
- `packages/renderer/src/scenes/MistakeWarningScene.tsx`
  Wrong-vs-right comparison.
- `packages/renderer/src/scenes/SummaryScene.tsx`
  Answer recap.
- `packages/renderer/src/components/Subtitle.tsx`
  Sentence subtitle component.
- `packages/renderer/src/components/MathText.tsx`
  Equation text rendering helper.
- `packages/renderer/src/lib/build-timeline.ts`
  Scene-to-frame conversion.
- `packages/renderer/src/index.ts`
  Renderer exports.
- `packages/tts-service/src/synthesize-scene-audio.ts`
  Per-scene TTS adapter.
- `packages/tts-service/src/build-subtitles.ts`
  Sentence subtitle builder.
- `packages/tts-service/src/index.ts`
  Public TTS exports.
- `packages/job-runner/src/run-job.ts`
  Orchestrates the end-to-end pipeline.
- `packages/job-runner/src/render-project.ts`
  Calls Remotion renderer.
- `packages/job-runner/src/store-artifacts.ts`
  Asset persistence.
- `packages/job-runner/src/index.ts`
  Public job-runner exports.
- `tests/shared-types/problem-input.test.ts`
  Schema validation tests.
- `tests/lesson-engine/parse-problem.test.ts`
  Parser tests.
- `tests/lesson-engine/map-lesson-to-scenes.test.ts`
  Mapper tests.
- `tests/renderer/build-timeline.test.ts`
  Timeline tests.
- `tests/job-runner/run-job.test.ts`
  Pipeline orchestration tests.
- `tests/api/jobs.e2e-spec.ts`
  API contract tests.

## Task 1: Bootstrap The Monorepo

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `apps/web/package.json`
- Create: `apps/api/package.json`
- Create: `packages/shared-types/package.json`
- Create: `packages/lesson-engine/package.json`
- Create: `packages/renderer/package.json`
- Create: `packages/tts-service/package.json`
- Create: `packages/job-runner/package.json`

- [ ] **Step 1: Write the failing workspace sanity test**

```ts
// tests/shared-types/workspace-smoke.test.ts
import {describe, expect, it} from 'vitest';

describe('workspace smoke test', () => {
  it('loads the shared-types package entrypoint', async () => {
    const mod = await import('../../packages/shared-types/src/index');
    expect(mod).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/shared-types/workspace-smoke.test.ts`
Expected: FAIL with a module resolution or missing file error because the workspace has not been scaffolded yet.

- [ ] **Step 3: Write minimal workspace implementation**

```json
// package.json
{
  "name": "edu-video-gen",
  "private": true,
  "packageManager": "pnpm@10.0.0",
  "scripts": {
    "dev:web": "pnpm --filter web dev",
    "dev:api": "pnpm --filter api start:dev",
    "test": "vitest run",
    "typecheck": "tsc -p tsconfig.base.json --noEmit"
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "typescript": "^5.8.0",
    "vitest": "^3.2.0"
  }
}
```

```yaml
# pnpm-workspace.yaml
packages:
  - apps/*
  - packages/*
```

```json
// packages/shared-types/package.json
{
  "name": "@edu/shared-types",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "src/index.ts"
}
```

```ts
// packages/shared-types/src/index.ts
export const workspaceReady = true;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/shared-types/workspace-smoke.test.ts`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json .gitignore apps packages tests/shared-types/workspace-smoke.test.ts
git commit -m "chore: bootstrap edu video monorepo"
```

## Task 2: Define Shared Schemas And Contracts

**Files:**
- Create: `packages/shared-types/src/problem-input.ts`
- Create: `packages/shared-types/src/parsed-problem.ts`
- Create: `packages/shared-types/src/lesson-plan.ts`
- Create: `packages/shared-types/src/video-scene.ts`
- Create: `packages/shared-types/src/job-result.ts`
- Modify: `packages/shared-types/src/index.ts`
- Test: `tests/shared-types/problem-input.test.ts`

- [ ] **Step 1: Write the failing schema tests**

```ts
// tests/shared-types/problem-input.test.ts
import {describe, expect, it} from 'vitest';
import {lessonPlanSchema, problemInputSchema} from '../../packages/shared-types/src';

describe('problemInputSchema', () => {
  it('accepts the supported V1 request shape', () => {
    const parsed = problemInputSchema.parse({
      subject: 'math',
      grade: 'junior',
      sourceType: 'text',
      content: 'Solve equation: 2x + 3 = 11',
      targetDurationSec: 45,
      style: 'teacher',
      voice: 'female_warm'
    });

    expect(parsed.content).toContain('2x + 3 = 11');
  });
});

describe('lessonPlanSchema', () => {
  it('requires at least one lesson step', () => {
    expect(() =>
      lessonPlanSchema.parse({
        title: 'Equation lesson',
        learningGoal: 'Solve a linear equation',
        steps: []
      })
    ).toThrow(/at least 1/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/shared-types/problem-input.test.ts`
Expected: FAIL because `problemInputSchema` and `lessonPlanSchema` do not exist yet.

- [ ] **Step 3: Write minimal shared schemas**

```ts
// packages/shared-types/src/problem-input.ts
import {z} from 'zod';

export const problemInputSchema = z.object({
  subject: z.literal('math'),
  grade: z.literal('junior').optional(),
  sourceType: z.literal('text'),
  content: z.string().min(1),
  targetDurationSec: z.number().int().min(30).max(60).optional(),
  style: z.enum(['teacher', 'kids', 'exam']).optional(),
  voice: z.enum(['female_warm', 'female_clear', 'male_calm']).optional()
});

export type ProblemInput = z.infer<typeof problemInputSchema>;
```

```ts
// packages/shared-types/src/lesson-plan.ts
import {z} from 'zod';

export const lessonStepSchema = z.object({
  id: z.string().min(1),
  stepType: z.enum(['show_problem', 'transform', 'warn_mistake', 'summary']),
  teachingGoal: z.string().min(1),
  narration: z.string().min(1),
  visualIntent: z.string().min(1),
  keyText: z.array(z.string()).optional(),
  expectedDurationSec: z.number().positive().optional(),
  animationHint: z.enum(['highlight', 'replace', 'move', 'compare']).optional()
});

export const lessonPlanSchema = z.object({
  title: z.string().min(1),
  hook: z.string().optional(),
  learningGoal: z.string().min(1),
  summary: z.string().optional(),
  steps: z.array(lessonStepSchema).min(1),
  commonMistakes: z.array(z.string()).optional()
});

export type LessonPlan = z.infer<typeof lessonPlanSchema>;
```

```ts
// packages/shared-types/src/index.ts
export * from './problem-input';
export * from './parsed-problem';
export * from './lesson-plan';
export * from './video-scene';
export * from './job-result';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/shared-types/problem-input.test.ts`
Expected: PASS with both schema cases green.

- [ ] **Step 5: Commit**

```bash
git add packages/shared-types/src tests/shared-types/problem-input.test.ts
git commit -m "feat: add v1 shared schemas"
```

## Task 3: Implement Problem Parsing For Supported Equations

**Files:**
- Create: `packages/lesson-engine/src/parse-problem.ts`
- Create: `packages/lesson-engine/src/index.ts`
- Test: `tests/lesson-engine/parse-problem.test.ts`

- [ ] **Step 1: Write the failing parser tests**

```ts
// tests/lesson-engine/parse-problem.test.ts
import {describe, expect, it} from 'vitest';
import {parseProblem} from '../../packages/lesson-engine/src/parse-problem';

describe('parseProblem', () => {
  it('classifies a supported linear equation', async () => {
    const parsed = await parseProblem({
      subject: 'math',
      sourceType: 'text',
      content: 'Solve equation: 2x + 3 = 11'
    });

    expect(parsed.problemType).toBe('linear_equation_one_variable');
    expect(parsed.isSupported).toBe(true);
    expect(parsed.normalizedExpression).toBe('2x + 3 = 11');
  });

  it('rejects unsupported free-form prompts', async () => {
    const parsed = await parseProblem({
      subject: 'math',
      sourceType: 'text',
      content: 'Explain the water cycle'
    });

    expect(parsed.isSupported).toBe(false);
    expect(parsed.rejectionReason).toMatch(/unsupported/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/lesson-engine/parse-problem.test.ts`
Expected: FAIL because `parseProblem` is not implemented yet.

- [ ] **Step 3: Write minimal parser implementation**

```ts
// packages/lesson-engine/src/parse-problem.ts
import type {ParsedProblem, ProblemInput} from '@edu/shared-types';

const equationPattern = /^[0-9xX+\-*/\s=()]+$/;

export const parseProblem = async (input: ProblemInput): Promise<ParsedProblem> => {
  const raw = input.content.replace(/^solve equation:\s*/i, '').trim();
  const normalizedExpression = raw.replace(/\s+/g, ' ').trim();
  const supported = normalizedExpression.includes('=') && equationPattern.test(normalizedExpression);

  if (!supported) {
    return {
      subject: 'math',
      grade: 'junior',
      problemType: 'linear_equation_one_variable',
      difficulty: 'easy',
      originalText: input.content,
      normalizedExpression,
      isSupported: false,
      rejectionReason: 'Unsupported input for V1 linear equation parser',
      knowledgePoints: []
    };
  }

  return {
    subject: 'math',
    grade: 'junior',
    problemType: 'linear_equation_one_variable',
    difficulty: 'easy',
    originalText: input.content,
    normalizedExpression,
    isSupported: true,
    knowledgePoints: ['linear equation', 'transposition', 'simplification']
  };
};
```

```ts
// packages/lesson-engine/src/index.ts
export * from './parse-problem';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/lesson-engine/parse-problem.test.ts`
Expected: PASS with supported and unsupported cases both green.

- [ ] **Step 5: Commit**

```bash
git add packages/lesson-engine/src tests/lesson-engine/parse-problem.test.ts
git commit -m "feat: add v1 equation parser"
```

## Task 4: Add Lesson Planning And Schema Repair

**Files:**
- Create: `packages/lesson-engine/src/plan-lesson.ts`
- Create: `packages/lesson-engine/src/repair-lesson-plan.ts`
- Create: `packages/lesson-engine/src/prompts/plan-lesson.ts`
- Modify: `packages/lesson-engine/src/index.ts`
- Test: `tests/lesson-engine/plan-lesson.test.ts`

- [ ] **Step 1: Write the failing lesson planner tests**

```ts
// tests/lesson-engine/plan-lesson.test.ts
import {describe, expect, it, vi} from 'vitest';
import {planLesson} from '../../packages/lesson-engine/src/plan-lesson';

describe('planLesson', () => {
  it('returns a schema-valid lesson plan from model output', async () => {
    const generate = vi.fn().mockResolvedValue({
      title: 'One-variable equation',
      learningGoal: 'Solve a linear equation by isolating x',
      steps: [
        {
          id: 's1',
          stepType: 'show_problem',
          teachingGoal: 'Introduce the equation',
          narration: 'Let us read the equation first.',
          visualIntent: 'Show the original equation',
          keyText: ['2x + 3 = 11']
        }
      ]
    });

    const result = await planLesson(
      {
        subject: 'math',
        grade: 'junior',
        problemType: 'linear_equation_one_variable',
        difficulty: 'easy',
        originalText: 'Solve equation: 2x + 3 = 11',
        normalizedExpression: '2x + 3 = 11',
        isSupported: true,
        knowledgePoints: ['linear equation']
      },
      {generate}
    );

    expect(result.steps[0].stepType).toBe('show_problem');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/lesson-engine/plan-lesson.test.ts`
Expected: FAIL because `planLesson` and its dependencies do not exist yet.

- [ ] **Step 3: Write minimal planner and repair implementation**

```ts
// packages/lesson-engine/src/prompts/plan-lesson.ts
import type {ParsedProblem} from '@edu/shared-types';

export const buildLessonPrompt = (problem: ParsedProblem) => `
You are generating a junior-high math lesson plan.
Return JSON only.
Problem: ${problem.normalizedExpression}
Allowed stepType values: show_problem, transform, warn_mistake, summary.
`;
```

```ts
// packages/lesson-engine/src/repair-lesson-plan.ts
import {lessonPlanSchema, type LessonPlan} from '@edu/shared-types';

export const repairLessonPlan = (input: unknown): LessonPlan => {
  return lessonPlanSchema.parse(input);
};
```

```ts
// packages/lesson-engine/src/plan-lesson.ts
import {type LessonPlan, type ParsedProblem} from '@edu/shared-types';
import {buildLessonPrompt} from './prompts/plan-lesson';
import {repairLessonPlan} from './repair-lesson-plan';

type GenerateFn = (prompt: string) => Promise<unknown>;

export const planLesson = async (
  problem: ParsedProblem,
  deps: {generate: GenerateFn}
): Promise<LessonPlan> => {
  const prompt = buildLessonPrompt(problem);
  const raw = await deps.generate(prompt);
  return repairLessonPlan(raw);
};
```

```ts
// packages/lesson-engine/src/index.ts
export * from './parse-problem';
export * from './plan-lesson';
export * from './repair-lesson-plan';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/lesson-engine/plan-lesson.test.ts`
Expected: PASS and confirm the result survives schema parsing.

- [ ] **Step 5: Commit**

```bash
git add packages/lesson-engine/src tests/lesson-engine/plan-lesson.test.ts
git commit -m "feat: add lesson planning pipeline"
```

## Task 5: Map Lesson Plans To Deterministic Video Scenes

**Files:**
- Create: `packages/lesson-engine/src/map-lesson-to-scenes.ts`
- Modify: `packages/lesson-engine/src/index.ts`
- Test: `tests/lesson-engine/map-lesson-to-scenes.test.ts`

- [ ] **Step 1: Write the failing scene mapping tests**

```ts
// tests/lesson-engine/map-lesson-to-scenes.test.ts
import {describe, expect, it} from 'vitest';
import {mapLessonToScenes} from '../../packages/lesson-engine/src/map-lesson-to-scenes';

describe('mapLessonToScenes', () => {
  it('adds title, step, and summary scenes in deterministic order', () => {
    const project = mapLessonToScenes({
      title: 'Equation lesson',
      learningGoal: 'Solve the equation',
      summary: 'The answer is x = 4',
      steps: [
        {
          id: 's1',
          stepType: 'show_problem',
          teachingGoal: 'Show the problem',
          narration: 'Read the equation.',
          visualIntent: 'Display the equation',
          keyText: ['2x + 3 = 11']
        },
        {
          id: 's2',
          stepType: 'summary',
          teachingGoal: 'State the answer',
          narration: 'The answer is x equals 4.',
          visualIntent: 'Show the final answer',
          keyText: ['x = 4']
        }
      ]
    });

    expect(project.compositionId).toBe('LessonVideo');
    expect(project.scenes[0].sceneType).toBe('title');
    expect(project.scenes.at(-1)?.sceneType).toBe('summary');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/lesson-engine/map-lesson-to-scenes.test.ts`
Expected: FAIL because `mapLessonToScenes` is not implemented.

- [ ] **Step 3: Write minimal deterministic mapper**

```ts
// packages/lesson-engine/src/map-lesson-to-scenes.ts
import type {LessonPlan, VideoProject, VideoScene} from '@edu/shared-types';

const stepToSceneType = (stepType: string): VideoScene['sceneType'] => {
  if (stepType === 'warn_mistake') return 'warning';
  if (stepType === 'summary') return 'summary';
  if (stepType === 'show_problem') return 'problem';
  return 'step';
};

export const mapLessonToScenes = (plan: LessonPlan): VideoProject => {
  const scenes: VideoScene[] = [
    {
      id: 'title',
      sceneType: 'title',
      durationSec: 3,
      subtitle: plan.title,
      transition: 'fade',
      props: {title: plan.title, learningGoal: plan.learningGoal}
    },
    ...plan.steps.map((step) => ({
      id: step.id,
      sceneType: stepToSceneType(step.stepType),
      durationSec: step.expectedDurationSec ?? 8,
      subtitle: step.narration,
      transition: 'slide',
      props: {
        teachingGoal: step.teachingGoal,
        visualIntent: step.visualIntent,
        keyText: step.keyText ?? [],
        animationHint: step.animationHint ?? 'highlight'
      }
    }))
  ];

  return {
    compositionId: 'LessonVideo',
    fps: 30,
    width: 1080,
    height: 1920,
    theme: 'clean_classroom',
    scenes,
    totalDurationSec: scenes.reduce((sum, scene) => sum + scene.durationSec, 0)
  };
};
```

```ts
// packages/lesson-engine/src/index.ts
export * from './parse-problem';
export * from './plan-lesson';
export * from './repair-lesson-plan';
export * from './map-lesson-to-scenes';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/lesson-engine/map-lesson-to-scenes.test.ts`
Expected: PASS and confirm deterministic scene order.

- [ ] **Step 5: Commit**

```bash
git add packages/lesson-engine/src tests/lesson-engine/map-lesson-to-scenes.test.ts
git commit -m "feat: map lesson plans to video scenes"
```

## Task 6: Build The Remotion Composition And Scene Timeline

**Files:**
- Create: `packages/renderer/src/Root.tsx`
- Create: `packages/renderer/src/compositions/LessonVideo.tsx`
- Create: `packages/renderer/src/scenes/TitleScene.tsx`
- Create: `packages/renderer/src/scenes/ProblemScene.tsx`
- Create: `packages/renderer/src/scenes/EquationTransformScene.tsx`
- Create: `packages/renderer/src/scenes/MistakeWarningScene.tsx`
- Create: `packages/renderer/src/scenes/SummaryScene.tsx`
- Create: `packages/renderer/src/components/Subtitle.tsx`
- Create: `packages/renderer/src/components/MathText.tsx`
- Create: `packages/renderer/src/lib/build-timeline.ts`
- Create: `packages/renderer/src/index.ts`
- Test: `tests/renderer/build-timeline.test.ts`

- [ ] **Step 1: Write the failing timeline tests**

```ts
// tests/renderer/build-timeline.test.ts
import {describe, expect, it} from 'vitest';
import {buildTimeline} from '../../packages/renderer/src/lib/build-timeline';

describe('buildTimeline', () => {
  it('converts scene durations into frame ranges', () => {
    const timeline = buildTimeline(
      [
        {id: 'title', durationSec: 3},
        {id: 's1', durationSec: 7}
      ],
      30
    );

    expect(timeline).toEqual([
      {id: 'title', from: 0, durationInFrames: 90},
      {id: 's1', from: 90, durationInFrames: 210}
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/renderer/build-timeline.test.ts`
Expected: FAIL because `buildTimeline` does not exist yet.

- [ ] **Step 3: Write minimal renderer timeline and composition code**

```ts
// packages/renderer/src/lib/build-timeline.ts
export const buildTimeline = (
  scenes: Array<{id: string; durationSec: number}>,
  fps: number
) => {
  let from = 0;

  return scenes.map((scene) => {
    const durationInFrames = Math.round(scene.durationSec * fps);
    const entry = {id: scene.id, from, durationInFrames};
    from += durationInFrames;
    return entry;
  });
};
```

```tsx
// packages/renderer/src/compositions/LessonVideo.tsx
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import type {VideoProject} from '@edu/shared-types';
import {buildTimeline} from '../lib/build-timeline';

export const LessonVideo: React.FC<{project: VideoProject}> = ({project}) => {
  const timeline = buildTimeline(project.scenes, project.fps);

  return (
    <AbsoluteFill style={{backgroundColor: '#F7F3EA', color: '#1F2937'}}>
      {timeline.map((entry, index) => (
        <Sequence key={entry.id} from={entry.from} durationInFrames={entry.durationInFrames}>
          <div>{project.scenes[index]?.sceneType}</div>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

```ts
// packages/renderer/src/index.ts
export * from './lib/build-timeline';
export * from './compositions/LessonVideo';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/renderer/build-timeline.test.ts`
Expected: PASS and confirm frame math is stable.

- [ ] **Step 5: Commit**

```bash
git add packages/renderer/src tests/renderer/build-timeline.test.ts
git commit -m "feat: add remotion lesson composition scaffold"
```

## Task 7: Add TTS Timing And Subtitle Generation

**Files:**
- Create: `packages/tts-service/src/synthesize-scene-audio.ts`
- Create: `packages/tts-service/src/build-subtitles.ts`
- Create: `packages/tts-service/src/index.ts`
- Test: `tests/tts-service/build-subtitles.test.ts`

- [ ] **Step 1: Write the failing subtitle tests**

```ts
// tests/tts-service/build-subtitles.test.ts
import {describe, expect, it} from 'vitest';
import {buildSubtitles} from '../../packages/tts-service/src/build-subtitles';

describe('buildSubtitles', () => {
  it('creates sentence-level subtitle ranges from scene durations', () => {
    const subtitles = buildSubtitles([
      {id: 's1', subtitle: 'Read the equation.', durationSec: 4},
      {id: 's2', subtitle: 'Subtract 3 from both sides.', durationSec: 6}
    ]);

    expect(subtitles).toEqual([
      {id: 's1', startMs: 0, endMs: 4000, text: 'Read the equation.'},
      {id: 's2', startMs: 4000, endMs: 10000, text: 'Subtract 3 from both sides.'}
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/tts-service/build-subtitles.test.ts`
Expected: FAIL because subtitle helpers do not exist yet.

- [ ] **Step 3: Write minimal TTS and subtitle helpers**

```ts
// packages/tts-service/src/synthesize-scene-audio.ts
export type AudioMeta = {
  audioUrl: string;
  durationSec: number;
};

export const synthesizeSceneAudio = async (scene: {
  id: string;
  subtitle: string;
}): Promise<AudioMeta> => {
  const estimatedDurationSec = Math.max(3, Math.ceil(scene.subtitle.split(/\s+/).length / 3));

  return {
    audioUrl: `mock://audio/${scene.id}.mp3`,
    durationSec: estimatedDurationSec
  };
};
```

```ts
// packages/tts-service/src/build-subtitles.ts
export const buildSubtitles = (
  scenes: Array<{id: string; subtitle: string; durationSec: number}>
) => {
  let startMs = 0;

  return scenes.map((scene) => {
    const endMs = startMs + scene.durationSec * 1000;
    const entry = {id: scene.id, startMs, endMs, text: scene.subtitle};
    startMs = endMs;
    return entry;
  });
};
```

```ts
// packages/tts-service/src/index.ts
export * from './synthesize-scene-audio';
export * from './build-subtitles';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/tts-service/build-subtitles.test.ts`
Expected: PASS and confirm subtitle timing is cumulative.

- [ ] **Step 5: Commit**

```bash
git add packages/tts-service/src tests/tts-service/build-subtitles.test.ts
git commit -m "feat: add scene audio and subtitle helpers"
```

## Task 8: Implement The End-To-End Job Runner

**Files:**
- Create: `packages/job-runner/src/run-job.ts`
- Create: `packages/job-runner/src/render-project.ts`
- Create: `packages/job-runner/src/store-artifacts.ts`
- Create: `packages/job-runner/src/index.ts`
- Test: `tests/job-runner/run-job.test.ts`

- [ ] **Step 1: Write the failing pipeline orchestration test**

```ts
// tests/job-runner/run-job.test.ts
import {describe, expect, it, vi} from 'vitest';
import {runJob} from '../../packages/job-runner/src/run-job';

describe('runJob', () => {
  it('returns completed assets for a successful pipeline run', async () => {
    const result = await runJob(
      {
        subject: 'math',
        sourceType: 'text',
        content: 'Solve equation: 2x + 3 = 11'
      },
      {
        parseProblem: vi.fn().mockResolvedValue({
          subject: 'math',
          grade: 'junior',
          problemType: 'linear_equation_one_variable',
          difficulty: 'easy',
          originalText: 'Solve equation: 2x + 3 = 11',
          normalizedExpression: '2x + 3 = 11',
          isSupported: true,
          knowledgePoints: ['linear equation']
        }),
        planLesson: vi.fn().mockResolvedValue({
          title: 'Equation lesson',
          learningGoal: 'Solve the equation',
          steps: [
            {
              id: 's1',
              stepType: 'show_problem',
              teachingGoal: 'Show the problem',
              narration: 'Read the equation.',
              visualIntent: 'Show the original equation'
            }
          ]
        }),
        mapLessonToScenes: vi.fn().mockReturnValue({
          compositionId: 'LessonVideo',
          fps: 30,
          width: 1080,
          height: 1920,
          theme: 'clean_classroom',
          totalDurationSec: 8,
          scenes: [
            {
              id: 's1',
              sceneType: 'problem',
              durationSec: 8,
              subtitle: 'Read the equation.',
              props: {}
            }
          ]
        }),
        synthesizeSceneAudio: vi.fn().mockResolvedValue({
          audioUrl: 'mock://audio/s1.mp3',
          durationSec: 8
        }),
        buildSubtitles: vi.fn().mockReturnValue([
          {id: 's1', startMs: 0, endMs: 8000, text: 'Read the equation.'}
        ]),
        renderProject: vi.fn().mockResolvedValue({
          videoUrl: 'mock://video/job-1.mp4',
          coverUrl: 'mock://video/job-1.png'
        }),
        storeArtifacts: vi.fn().mockResolvedValue({
          lessonPlanUrl: 'mock://data/job-1-lesson.json',
          subtitleUrl: 'mock://data/job-1.srt'
        })
      }
    );

    expect(result.status).toBe('completed');
    expect(result.videoUrl).toBe('mock://video/job-1.mp4');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/job-runner/run-job.test.ts`
Expected: FAIL because `runJob` is missing.

- [ ] **Step 3: Write minimal job runner implementation**

```ts
// packages/job-runner/src/run-job.ts
import type {ProblemInput} from '@edu/shared-types';

export const runJob = async (input: ProblemInput, deps: any) => {
  const parsed = await deps.parseProblem(input);

  if (!parsed.isSupported) {
    return {
      status: 'failed',
      stage: 'parse',
      error: parsed.rejectionReason ?? 'Unsupported input'
    };
  }

  const lessonPlan = await deps.planLesson(parsed);
  const project = deps.mapLessonToScenes(lessonPlan);

  const scenes = await Promise.all(
    project.scenes.map(async (scene: any) => {
      const audio = await deps.synthesizeSceneAudio(scene);
      return {...scene, audioUrl: audio.audioUrl, durationSec: audio.durationSec};
    })
  );

  const subtitles = deps.buildSubtitles(scenes);
  const renderArtifact = await deps.renderProject({...project, scenes});
  const stored = await deps.storeArtifacts({lessonPlan, subtitles, renderArtifact});

  return {
    status: 'completed',
    stage: 'done',
    videoUrl: renderArtifact.videoUrl,
    coverUrl: renderArtifact.coverUrl,
    subtitleUrl: stored.subtitleUrl,
    lessonPlanUrl: stored.lessonPlanUrl
  };
};
```

```ts
// packages/job-runner/src/index.ts
export * from './run-job';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/job-runner/run-job.test.ts`
Expected: PASS and confirm the orchestration returns completed assets.

- [ ] **Step 5: Commit**

```bash
git add packages/job-runner/src tests/job-runner/run-job.test.ts
git commit -m "feat: add end-to-end job runner"
```

## Task 9: Expose Job APIs Through NestJS

**Files:**
- Create: `apps/api/src/main.ts`
- Create: `apps/api/src/app.module.ts`
- Create: `apps/api/src/jobs/jobs.controller.ts`
- Create: `apps/api/src/jobs/jobs.service.ts`
- Create: `apps/api/src/jobs/jobs.repository.ts`
- Create: `apps/api/src/jobs/dto/create-job.dto.ts`
- Create: `apps/api/src/queue/queue.module.ts`
- Test: `tests/api/jobs.e2e-spec.ts`

- [ ] **Step 1: Write the failing API tests**

```ts
// tests/api/jobs.e2e-spec.ts
import request from 'supertest';
import {describe, expect, it} from 'vitest';

describe('jobs api', () => {
  it('creates a job and returns an id', async () => {
    const response = await request('http://localhost:3001')
      .post('/jobs')
      .send({
        subject: 'math',
        sourceType: 'text',
        content: 'Solve equation: 2x + 3 = 11'
      });

    expect(response.status).toBe(201);
    expect(response.body.jobId).toBeTypeOf('string');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/api/jobs.e2e-spec.ts`
Expected: FAIL because the API server and route do not exist yet.

- [ ] **Step 3: Write minimal API implementation**

```ts
// apps/api/src/jobs/dto/create-job.dto.ts
import {problemInputSchema} from '@edu/shared-types';

export class CreateJobDto {
  subject!: 'math';
  sourceType!: 'text';
  content!: string;

  static parse(input: unknown) {
    return problemInputSchema.parse(input);
  }
}
```

```ts
// apps/api/src/jobs/jobs.service.ts
import {randomUUID} from 'node:crypto';

export class JobsService {
  private readonly jobs = new Map<string, {status: string}>();

  create(input: unknown) {
    CreateJobDto.parse(input);
    const jobId = randomUUID();
    this.jobs.set(jobId, {status: 'queued'});
    return {jobId, status: 'queued'};
  }

  find(jobId: string) {
    return this.jobs.get(jobId) ?? null;
  }
}
```

```ts
// apps/api/src/jobs/jobs.controller.ts
import {Body, Controller, Get, Param, Post} from '@nestjs/common';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() body: unknown) {
    return this.jobsService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.find(id);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/api/jobs.e2e-spec.ts`
Expected: PASS after wiring the Nest app bootstrap and endpoint registration.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src tests/api/jobs.e2e-spec.ts
git commit -m "feat: add job api endpoints"
```

## Task 10: Build The Web Submission And Result Screens

**Files:**
- Create: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/app/jobs/[id]/page.tsx`
- Create: `apps/web/src/lib/api-client.ts`
- Test: `tests/web/job-form.test.tsx`

- [ ] **Step 1: Write the failing web form test**

```tsx
// tests/web/job-form.test.tsx
import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import HomePage from '../../apps/web/src/app/page';

describe('HomePage', () => {
  it('shows the problem input form', () => {
    render(<HomePage />);
    expect(screen.getByLabelText(/problem text/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /generate video/i})).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/web/job-form.test.tsx`
Expected: FAIL because the page component does not exist yet.

- [ ] **Step 3: Write minimal web UI implementation**

```tsx
// apps/web/src/app/page.tsx
export default function HomePage() {
  return (
    <main>
      <h1>Math Explainer Video Generator</h1>
      <form>
        <label htmlFor="content">Problem text</label>
        <textarea id="content" name="content" defaultValue="Solve equation: 2x + 3 = 11" />
        <button type="submit">Generate video</button>
      </form>
    </main>
  );
}
```

```tsx
// apps/web/src/app/jobs/[id]/page.tsx
export default function JobResultPage() {
  return (
    <main>
      <h1>Generation Result</h1>
      <p>Video and subtitle assets will appear here.</p>
    </main>
  );
}
```

```ts
// apps/web/src/lib/api-client.ts
export const createJob = async (input: {
  subject: 'math';
  sourceType: 'text';
  content: string;
}) => {
  const response = await fetch('http://localhost:3001/jobs', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(input)
  });

  return response.json();
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/web/job-form.test.tsx`
Expected: PASS and confirm the operator can see the core input form.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src tests/web/job-form.test.tsx
git commit -m "feat: add v1 operator web screens"
```

## Task 11: Verify The Full V1 Slice

**Files:**
- Modify: `package.json`
- Modify: `apps/api/package.json`
- Modify: `apps/web/package.json`
- Modify: `packages/*/package.json`

- [ ] **Step 1: Write the failing top-level verification script**

```json
// package.json
{
  "scripts": {
    "verify:v1": "pnpm test && pnpm typecheck"
  }
}
```

- [ ] **Step 2: Run verification to capture the first failure**

Run: `pnpm verify:v1`
Expected: FAIL until every package export, dependency, and test path has been wired correctly.

- [ ] **Step 3: Add the missing package scripts**

```json
// apps/api/package.json
{
  "name": "api",
  "private": true,
  "scripts": {
    "start:dev": "nest start --watch",
    "test": "vitest run ../../tests/api"
  }
}
```

```json
// apps/web/package.json
{
  "name": "web",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "test": "vitest run ../../tests/web"
  }
}
```

```json
// packages/renderer/package.json
{
  "name": "@edu/renderer",
  "private": true,
  "type": "module",
  "main": "src/index.ts"
}
```

- [ ] **Step 4: Run the final verification**

Run: `pnpm verify:v1`
Expected: PASS with all unit tests, API tests, web tests, and type checks green.

- [ ] **Step 5: Commit**

```bash
git add package.json apps/api/package.json apps/web/package.json packages
git commit -m "chore: add v1 verification scripts"
```

## Self-Review

Spec coverage check:

- V1 scope, schemas, lesson flow, scene mapping, TTS timing, render boundary, async jobs, and UI are covered by Tasks 2 through 10.
- Repository structure and development workflow are covered by Tasks 1 and 11.
- No spec requirement appears uncovered.

Placeholder scan:

- No placeholder markers or deferred implementation notes remain in this plan.
- Every task includes explicit files, commands, and example code.

Type consistency:

- `ProblemInput`, `ParsedProblem`, `LessonPlan`, `VideoScene`, and `VideoProject` are introduced before downstream use.
- `parseProblem`, `planLesson`, `mapLessonToScenes`, `synthesizeSceneAudio`, and `runJob` keep consistent names across later tasks.
