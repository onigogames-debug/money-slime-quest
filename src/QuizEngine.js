import questionsData from './data/questions.json';

/**
 * Total number of stages and sets in the game.
 */
export const TOTAL_STAGES = 12;
export const SETS_PER_STAGE = 10;
export const TOTAL_SETS = TOTAL_STAGES * SETS_PER_STAGE;

/**
 * Metadata for each stage including titles and visual themes.
 */
export const STAGE_META = [
  { stage: 1,  title: 'お金の正体',           theme: 'money_origin',  colorFrom: '#00c8ff', colorTo: '#0080ff' },
  { stage: 2,  title: '稼ぐ力の源泉',          theme: 'earning',       colorFrom: '#7c3aed', colorTo: '#4f46e5' },
  { stage: 3,  title: '賢い支出と節約',        theme: 'spending',      colorFrom: '#10b981', colorTo: '#059669' },
  { stage: 4,  title: '銀行と社会の仕組み',    theme: 'banking',       colorFrom: '#f59e0b', colorTo: '#d97706' },
  { stage: 5,  title: 'キャッシュフロー基礎',  theme: 'cashflow',      colorFrom: '#ef4444', colorTo: '#dc2626' },
  { stage: 6,  title: '投資の第一歩',          theme: 'investment',    colorFrom: '#ec4899', colorTo: '#db2777' },
  { stage: 7,  title: '税金と社会保障',        theme: 'tax',           colorFrom: '#8b5cf6', colorTo: '#7c3aed' },
  { stage: 8,  title: '自己投資とキャリア',    theme: 'career',        colorFrom: '#14b8a6', colorTo: '#0d9488' },
  { stage: 9,  title: '起業とビジネスモデル',  theme: 'business',      colorFrom: '#f97316', colorTo: '#ea580c' },
  { stage: 10, title: '不動産と現物資産',      theme: 'realestate',    colorFrom: '#06b6d4', colorTo: '#0891b2' },
  { stage: 11, title: '未来のテクノロジー',    theme: 'technology',    colorFrom: '#84cc16', colorTo: '#65a30d' },
  { stage: 12, title: '富の哲学と寄付',        theme: 'philosophy',    colorFrom: '#ffd700', colorTo: '#f59e0b' },
];

/**
 * Shuffle an array in-place using Fisher-Yates algorithm.
 * @param {Array} array 
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Retrieves a 10-question set for a specific stage and set number.
 * Shuffles the options for each question to ensure variety.
 * @param {number} stage - Stage number (1-12)
 * @param {number} set - Set number (1-10)
 * @returns {Array} Array of question objects
 */
export function getSessionQuestions(stage, set) {
  const questions = questionsData.filter(
    (q) => q.stage === stage && q.set === set
  );

  // Return a new object with shuffled options to avoid mutating original source if needed
  return questions.map(q => ({
    ...q,
    options: shuffleArray([...q.options])
  }));
}

/**
 * Checks if a specific set has been completed by the player.
 * @param {object} progress - Player progress object
 * @param {number} stage - Stage number
 * @param {number} set - Set number
 * @returns {boolean} True if completed
 */
export function isSetCompleted(progress, stage, set) {
  return progress.completedSets.has(`${stage}-${set}`);
}

/**
 * Determines the next session (stage and set) after completing the current one.
 * @param {number} stage - Current stage
 * @param {number} set - Current set
 * @returns {object|null} Next stage/set or null if game complete
 */
export function getNextSession(stage, set) {
  if (set < SETS_PER_STAGE) return { stage, set: set + 1 };
  if (stage < TOTAL_STAGES) return { stage: stage + 1, set: 1 };
  return null;
}

/**
 * Calculates the overall progress percentage based on completed sets.
 * @param {Set<string>} completedSets - Set of completed stage-set keys
 * @returns {number} Progress percentage (0-100)
 */
export function calcOverallProgress(completedSets) {
  return Math.round((completedSets.size / TOTAL_SETS) * 100);
}
