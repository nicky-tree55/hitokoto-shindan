import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { QuestionStep } from "./question-step";

const question = { id: "q1", genreId: "personality", text: "最近どう過ごしていますか？" };

describe("QuestionStep", () => {
  it("renders the question text, answer form, and back button", () => {
    const html = renderToStaticMarkup(
      <QuestionStep question={question} formAction={() => {}} onBack={() => {}} />,
    );

    expect(html).toContain(question.text);
    expect(html).toContain("診断する");
    expect(html).toContain("戻る");
  });

  it("renders the error message when provided", () => {
    const html = renderToStaticMarkup(
      <QuestionStep
        question={question}
        formAction={() => {}}
        onBack={() => {}}
        errorMessage="失敗しました"
      />,
    );

    expect(html).toContain("失敗しました");
  });
});
