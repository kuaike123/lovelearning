# Featured Samples Config Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the sample-library metadata into a validated configuration layer without changing homepage or sample-detail behavior.

**Architecture:** Keep page components consuming a single `featured-samples.ts` interface, but split raw sample metadata into a dedicated data file and validate it once with Zod before exporting helpers. Preserve current filtering, sorting, and slug lookup APIs so UI code stays unchanged.

**Tech Stack:** TypeScript, Zod, Vitest, Next.js app router

---

### Task 1: Split raw sample metadata from helper logic

**Files:**
- Create: `apps/web/src/app/featured-samples.data.ts`
- Modify: `apps/web/src/app/featured-samples.ts`

- [ ] **Step 1: Create the raw metadata file**

```ts
export const featuredSampleRecords = [
  {
    slug: 'linear-equation-basic',
    title: '初一方程标准讲解',
    // ...existing metadata fields
  }
] as const;
```

- [ ] **Step 2: Move the sample array into the data file**

```ts
// Remove the inline array from featured-samples.ts
// Import the raw records instead:
import {featuredSampleRecords} from './featured-samples.data';
```

- [ ] **Step 3: Keep UI-facing helper exports in featured-samples.ts**

```ts
export const getFeaturedSampleBySlug = (slug: string) => {
  return featuredSamples.find((sample) => sample.slug === slug) ?? null;
};
```

### Task 2: Add Zod validation around sample metadata

**Files:**
- Modify: `apps/web/src/app/featured-samples.ts`
- Test: `tests/web/featured-samples.test.ts`

- [ ] **Step 1: Define the Zod schema and inferred type**

```ts
import {z} from 'zod';

export const featuredSampleSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  taskName: z.string().min(1),
  content: z.string().min(1),
  description: z.string().min(1),
  posterKicker: z.string().min(1),
  posterCaption: z.string().min(1),
  gradeBand: z.string().min(1),
  conversionScenario: z.string().min(1),
  recommendationScore: z.number().int().min(0).max(100),
  publishedAt: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/),
  isFeatured: z.boolean(),
  highlights: z.array(z.string().min(1)).min(1),
  useCases: z.array(z.string().min(1)).min(1),
  problemCategory: z.enum(['equation', 'word_problem']),
  primaryUseCase: z.enum(['recruitment', 'homework', 'classroom']),
  style: z.enum(['teacher', 'kids', 'exam']),
  targetDurationSec: z.union([z.literal(30), z.literal(45), z.literal(60)]),
  voice: z.enum(['female_warm', 'female_clear', 'male_calm'])
});

export type FeaturedSample = z.infer<typeof featuredSampleSchema>;
```

- [ ] **Step 2: Parse the raw data once at module load**

```ts
export const featuredSamples = featuredSampleSchema.array().parse(featuredSampleRecords);
```

- [ ] **Step 3: Add test coverage for validation and helper stability**

```ts
it('exports valid featured sample records with stable slugs', () => {
  expect(featuredSamples.map((sample) => sample.slug)).toEqual([
    'linear-equation-basic',
    'quantity-relation-word-problem'
  ]);
});
```

### Task 3: Verify the refactor does not change product behavior

**Files:**
- Test: `tests/web/featured-samples.test.ts`

- [ ] **Step 1: Run targeted tests**

Run: `pnpm vitest run tests/web/featured-samples.test.ts tests/web/job-form.test.tsx tests/web/sample-detail-page.test.tsx`
Expected: PASS

- [ ] **Step 2: Run full v1 verification**

Run: `pnpm verify:v1`
Expected: PASS

- [ ] **Step 3: Run Vercel build verification**

Run: `pnpm run vercel-build`
Expected: PASS
