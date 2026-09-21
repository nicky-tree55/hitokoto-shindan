/**
 * Question: あるGenreに属する質問。フリーテキストで回答されることを前提とする
 * （選択式のAnswerは持たない。実際の分類はJevによる自然文解釈に委ねる）。
 */
export interface Question {
  readonly id: string;
  readonly genreId: string;
  readonly text: string;
}

export interface CreateQuestionInput {
  readonly id: string;
  readonly genreId: string;
  readonly text: string;
}

export function createQuestion(input: CreateQuestionInput): Question {
  const id = input.id.trim();
  const genreId = input.genreId.trim();
  const text = input.text.trim();

  if (id.length === 0) {
    throw new Error("Question.id must not be empty");
  }
  if (genreId.length === 0) {
    throw new Error("Question.genreId must not be empty");
  }
  if (text.length === 0) {
    throw new Error("Question.text must not be empty");
  }

  return { id, genreId, text };
}
