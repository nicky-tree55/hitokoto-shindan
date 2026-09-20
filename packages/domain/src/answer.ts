/**
 * Answer: 質問(Question)に対する選択肢を表す値オブジェクト。
 * 選択された場合にどのTypeへ加点されるかをtypeIdで表す。
 */
export interface Answer {
  readonly id: string;
  readonly text: string;
  readonly typeId: string;
}

export interface CreateAnswerInput {
  readonly id: string;
  readonly text: string;
  readonly typeId: string;
}

export function createAnswer(input: CreateAnswerInput): Answer {
  const id = input.id.trim();
  const text = input.text.trim();
  const typeId = input.typeId.trim();

  if (id.length === 0) {
    throw new Error("Answer.id must not be empty");
  }
  if (text.length === 0) {
    throw new Error("Answer.text must not be empty");
  }
  if (typeId.length === 0) {
    throw new Error("Answer.typeId must not be empty");
  }

  return { id, text, typeId };
}
