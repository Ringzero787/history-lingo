// Client-side Gemini types (actual API calls happen in Cloud Functions)

// Question type identifiers
export const QUESTION_TYPES = [
  'multiple_choice',
  'timeline_order',
  'true_false',
  'fill_blank',
  'who_said_it',
  'story_completion',
] as const;

export type QuestionType = typeof QUESTION_TYPES[number];

// Lesson generation request (sent to Cloud Function)
export interface GenerateLessonRequest {
  eraId: string;
  subcategory: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  ageGroup: 'child' | 'teen' | 'adult';
  lessonOrder: number;
  questionTypes?: QuestionType[];
}

// Lesson generation response (returned from Cloud Function)
export interface GenerateLessonResponse {
  success: boolean;
  lessonId?: string;
  error?: string;
}
