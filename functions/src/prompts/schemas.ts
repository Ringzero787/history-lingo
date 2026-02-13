import { z } from "zod";

// Question schemas
const multipleChoiceSchema = z.object({
  type: z.literal("multiple_choice"),
  prompt: z.string().min(10),
  options: z.array(z.string().min(1)).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().min(10),
  imageUrl: z.string().optional(),
});

const timelineOrderSchema = z.object({
  type: z.literal("timeline_order"),
  prompt: z.string().min(10),
  events: z.array(z.object({
    text: z.string().min(1),
    year: z.number().int(),
  })).min(3).max(6),
  explanation: z.string().min(10),
});

const trueFalseSchema = z.object({
  type: z.literal("true_false"),
  statement: z.string().min(10),
  correct: z.boolean(),
  explanation: z.string().min(10),
});

const fillBlankSchema = z.object({
  type: z.literal("fill_blank"),
  template: z.string().min(10).refine((s) => s.includes("___"), {
    message: "Template must contain '___' placeholder",
  }),
  answer: z.string().min(1),
  acceptableAnswers: z.array(z.string()),
  explanation: z.string().min(10),
});

const whoSaidItSchema = z.object({
  type: z.literal("who_said_it"),
  quote: z.string().min(10),
  options: z.array(z.string().min(1)).length(4),
  correctIndex: z.number().int().min(0).max(3),
  context: z.string().min(10),
});

const storyCompletionSchema = z.object({
  type: z.literal("story_completion"),
  narrative: z.string().min(20),
  blanks: z.array(z.object({
    answer: z.string().min(1),
    acceptableAnswers: z.array(z.string()),
  })).min(1),
  explanation: z.string().min(10),
});

const questionSchema = z.discriminatedUnion("type", [
  multipleChoiceSchema,
  timelineOrderSchema,
  trueFalseSchema,
  fillBlankSchema,
  whoSaidItSchema,
  storyCompletionSchema,
]);

export const lessonSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(500),
  questions: z.array(questionSchema).min(8).max(12),
  funFacts: z.array(z.string().min(10)).min(3).max(8),
});

export type LessonOutput = z.infer<typeof lessonSchema>;
