export interface LessonPromptParams {
  era: string;
  subcategory: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  ageGroup: "child" | "teen" | "adult";
  lessonNumber: number;
}

const AGE_INSTRUCTIONS = {
  child:
    "Use simple, clear language appropriate for children under 13. Avoid graphic descriptions of violence. Focus on interesting facts, stories, and discoveries. Use analogies to modern life.",
  teen:
    "Use engaging language appropriate for teenagers. You can discuss conflict and political complexity at a moderate level. Include interesting anecdotes and connections to modern culture.",
  adult:
    "Use sophisticated language. Include primary source references where relevant. Discuss historiographical debates and nuanced perspectives. Include complex political, social, and economic analysis.",
};

const DIFFICULTY_INSTRUCTIONS = {
  beginner:
    "Focus on fundamental facts, key figures, and major events. Questions should test recall and basic understanding. Provide clear, straightforward explanations.",
  intermediate:
    "Go beyond basic facts to include causes, effects, and connections between events. Questions should test understanding and analysis. Include some lesser-known but interesting details.",
  advanced:
    "Include historiographical debates, primary sources, and nuanced analysis. Questions should test critical thinking and synthesis. Challenge common misconceptions with evidence-based answers.",
};

export function buildLessonPrompt(params: LessonPromptParams): string {
  const { era, subcategory, difficulty, ageGroup, lessonNumber } = params;

  return `You are an expert history educator creating an interactive lesson for a mobile learning app.

## Context
- Historical Era: ${era}
- Topic/Subcategory: ${subcategory}
- Lesson Number: ${lessonNumber} in the ${era} series
- Difficulty: ${difficulty}
- Target Audience Age: ${ageGroup}

## Age-Appropriate Content Guidelines
${AGE_INSTRUCTIONS[ageGroup]}

## Difficulty Guidelines
${DIFFICULTY_INSTRUCTIONS[difficulty]}

## Lesson Requirements
Create a lesson with:

1. **Title**: A compelling, specific title for this lesson (not just the era name)
2. **Description**: A 1-2 sentence hook that makes students want to learn
3. **Questions** (8-12 questions): Mix of the following types:
   - **multiple_choice**: 4 options, one correct, with explanation
   - **true_false**: A statement that is clearly true or false, with explanation
   - **fill_blank**: A sentence with a ___ blank to fill in, with answer and acceptable alternatives
   - **timeline_order**: 3-6 events to order chronologically
   - **who_said_it**: A historical quote with 4 possible speakers
   - **story_completion**: A narrative paragraph with blanks to fill

   Use a good mix of at least 3 different question types. Ensure questions build from easier to harder within the lesson.

4. **Fun Facts** (3-8): Interesting "did you know?" facts related to the lesson topic

## Quality Requirements
- All historical facts must be accurate
- Explanations should teach, not just confirm the answer
- Questions should be unambiguous with clearly correct answers
- Fun facts should be surprising and memorable
- Content must be appropriate for the target age group

## Output Format
Respond with a valid JSON object matching this exact structure:
{
  "title": "string",
  "description": "string",
  "questions": [
    // Mix of question types as described above
  ],
  "funFacts": ["string", ...]
}`;
}

export const SYSTEM_PROMPT = `You are HistoryLingo AI, an expert history educator that creates engaging, accurate, and age-appropriate educational content. You generate structured lesson data in JSON format for a mobile learning application. Your lessons are fun, informative, and pedagogically sound. You always ensure historical accuracy and cite well-established facts.`;
