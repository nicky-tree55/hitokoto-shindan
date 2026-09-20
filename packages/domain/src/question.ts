import type { Answer } from "./answer";

/**
 * Question: あるGenreに属する質問。1つ以上のAnswer（選択肢）を持つ。
 */
export interface Question {
  readonly id: string;
  readonly genreId: string;
  readonly text: string;
  readonly answers: readonly Answer[];
}

export interface CreateQuestionInput {
  readonly id: string;
  readonly genreId: string;
  readonly text: string;
  readonly answers: readonly Answer[];
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
  if (input.answers.length === 0) {
    throw new Error("Question.answers must have at least one Answer");
  }

  return { id, genreId, text, answers: input.answers };
}
