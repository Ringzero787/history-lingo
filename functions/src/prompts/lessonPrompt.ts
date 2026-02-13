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
3. **Questions** (8-12 questions): Use a good mix of at least 3 different question types from the types below. Ensure questions build from easier to harder.
4. **Fun Facts** (3-8): Interesting "did you know?" facts related to the lesson topic

## Quality Requirements
- All historical facts must be accurate
- Explanations should teach, not just confirm the answer
- Questions should be unambiguous with clearly correct answers
- Fun facts should be surprising and memorable
- Content must be appropriate for the target age group

## Output Format
Respond with a valid JSON object. You MUST use the EXACT field names shown below for each question type. Do not rename or omit any fields.

{
  "title": "Lesson Title Here",
  "description": "A 1-2 sentence hook.",
  "questions": [
    {
      "type": "multiple_choice",
      "prompt": "What was the main cause of...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 2,
      "explanation": "The correct answer is C because..."
    },
    {
      "type": "true_false",
      "statement": "Napoleon was born in Corsica.",
      "correct": true,
      "explanation": "Napoleon was indeed born in Corsica in 1769."
    },
    {
      "type": "fill_blank",
      "template": "The ___ was signed in 1215 by King John.",
      "answer": "Magna Carta",
      "acceptableAnswers": ["Magna Carta", "magna carta"],
      "explanation": "The Magna Carta was a charter of rights..."
    },
    {
      "type": "timeline_order",
      "prompt": "Put these events in chronological order:",
      "events": [
        {"text": "Event one happened", "year": 1066},
        {"text": "Event two happened", "year": 1215},
        {"text": "Event three happened", "year": 1453}
      ],
      "explanation": "These events span from the Norman Conquest to..."
    },
    {
      "type": "who_said_it",
      "quote": "I came, I saw, I conquered.",
      "options": ["Julius Caesar", "Alexander the Great", "Napoleon", "Genghis Khan"],
      "correctIndex": 0,
      "context": "Julius Caesar reportedly said this after..."
    },
    {
      "type": "story_completion",
      "narrative": "In 1492, ___ set sail across the Atlantic Ocean. His expedition was funded by ___ of Spain.",
      "blanks": [
        {"answer": "Columbus", "acceptableAnswers": ["Columbus", "Christopher Columbus"]},
        {"answer": "Isabella", "acceptableAnswers": ["Isabella", "Queen Isabella"]}
      ],
      "explanation": "Christopher Columbus's voyage was funded by..."
    }
  ],
  "funFacts": ["Did you know that...", "Interestingly,...", "A lesser-known fact is..."]
}

CRITICAL: Use EXACTLY these field names: "prompt" (not "question"), "correctIndex" (not "correct_answer" or "answer_index"), "statement" (not "question" or "prompt"), "template" (not "sentence" or "question"), "acceptableAnswers" (not "acceptable_answers"), "context" (not "explanation" for who_said_it), "narrative" (not "story" or "text"), "blanks" (not "answers").`;
}

export const SYSTEM_PROMPT = `You are HistoryLingo AI, an expert history educator that creates engaging, accurate, and age-appropriate educational content. You generate structured lesson data in JSON format for a mobile learning application. Your lessons are fun, informative, and pedagogically sound. You always ensure historical accuracy and cite well-established facts.`;
