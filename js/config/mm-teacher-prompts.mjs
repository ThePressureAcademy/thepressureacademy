const years = ["prep", "1", "2", "3", "4", "5", "6"];
const prompts = {
  reading: [
    "Which sounds, words or pictures should the student notice in this text?",
    "Which word-reading or retelling strategy are they practising?",
    "Which words or details should they use to explain what they read?",
    "Which part of the text should they use to support their answer?",
    "Which idea should they explain or infer from this text?",
    "What evidence from the text should they connect to their interpretation?",
    "How should they compare viewpoints, language or evidence in the text?",
  ],
  writing: [
    "What could the student draw, say or write to express an idea?",
    "What should they include in the sentence they write?",
    "Which sentence, spelling or sequencing skill should they practise?",
    "How should they organise ideas for this piece of writing?",
    "Which paragraph or editing skill is the focus?",
    "Which detail or language choice would strengthen the writing?",
    "How should they revise the writing for its purpose and audience?",
  ],
  maths: [
    "What could they count, sort or show with objects?",
    "What should they show with objects, a drawing or numbers?",
    "Which strategy should they use to show how they worked it out?",
    "How should they represent the problem and explain their steps?",
    "Which method or representation should they choose for this task?",
    "Which steps should they record or check as they solve it?",
    "How should they justify the method or check whether the answer is reasonable?",
  ],
  other: [
    "What should they notice, name or demonstrate in this activity?",
    "What should they observe, make or describe in this subject?",
    "Which subject words or practical actions should they use?",
    "Which idea should they explain using an example from class?",
    "How should they apply the class concept to this task?",
    "What evidence, process or example should appear in their response?",
    "What should their investigation, explanation or finished work demonstrate?",
  ],
};

export function getSubjectPrompt(yearLevel, subject) {
  const level = years.indexOf(yearLevel);
  return level >= 0 && Object.hasOwn(prompts, subject) ? prompts[subject][level] : "";
}
