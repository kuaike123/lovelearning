export type ChatModel = 'standard' | 'deep' | 'fast';
export type ChatOutputType = 'video' | 'ppt' | 'lesson_plan' | 'exam';

export const chatModelOptions: {label: string; value: ChatModel}[] = [
  {label: '标准模型', value: 'standard'},
  {label: '深度讲解模型', value: 'deep'},
  {label: '快速模型', value: 'fast'}
];

export const outputTypeOptions: {label: string; value: ChatOutputType}[] = [
  {label: '讲解视频', value: 'video'},
  {label: 'PPT', value: 'ppt'},
  {label: '教案', value: 'lesson_plan'},
  {label: '试卷', value: 'exam'}
];

export const buildGenerationPrompt = ({
  model,
  outputType
}: {
  model: ChatModel;
  outputType: ChatOutputType;
}) => {
  const modelInstruction = modelInstructions[model];
  const outputInstruction = outputInstructions[outputType];

  return `${modelInstruction}\n${outputInstruction}`;
};

const modelInstructions: Record<ChatModel, string> = {
  deep: '模型策略：进行更细致的教学拆解，补充易错点、讲解铺垫和课堂引导。',
  fast: '模型策略：优先快速生成，保持步骤清晰，减少展开解释。',
  standard: '模型策略：使用标准教培讲解节奏，兼顾清晰度和生成速度。'
};

const outputInstructions: Record<ChatOutputType, string> = {
  exam: '输出类型：试卷。请围绕题目生成同类练习题、答案和简短解析。',
  lesson_plan: '输出类型：教案。请围绕题目生成教学目标、教学流程、板书设计和课堂提问。',
  ppt: '输出类型：PPT。请围绕题目生成适合课件页的标题、分页结构和每页要点。',
  video: '输出类型：讲解视频。请围绕题目生成分镜、字幕、配音和动画讲解节奏。'
};
