import { afterEach, describe, expect, it, mock } from "bun:test";
import { diagnoseAction, initialDiagnoseActionState } from "./actions";

function buildFormData(answerText: string): FormData {
  const formData = new FormData();
  formData.set("answerText", answerText);
  return formData;
}

describe("diagnoseAction", () => {
  afterEach(() => {
    mock.restore();
  });

  it("returns an error state when the answer text is empty", async () => {
    const state = await diagnoseAction(
      "personality",
      "q1",
      initialDiagnoseActionState,
      buildFormData("   "),
    );

    expect(state).toEqual({ status: "error", message: "回答を入力してください" });
  });

  it("returns a done state with the diagnose result on success", async () => {
    globalThis.fetch = mock(async () =>
      Response.json({
        type: { id: "leader", genreId: "personality", name: "リーダー型", description: "説明" },
        score: 1,
      }),
    ) as unknown as typeof fetch;

    const state = await diagnoseAction(
      "personality",
      "q1",
      initialDiagnoseActionState,
      buildFormData("朝から活動的に過ごしました。"),
    );

    expect(state.status).toBe("done");
    if (state.status === "done") {
      expect(state.result.type.id).toBe("leader");
    }
  });

  it("returns an error state when the API call fails", async () => {
    globalThis.fetch = mock(
      async () => new Response("error", { status: 500 }),
    ) as unknown as typeof fetch;

    const state = await diagnoseAction(
      "personality",
      "q1",
      initialDiagnoseActionState,
      buildFormData("回答テキスト"),
    );

    expect(state.status).toBe("error");
  });
});
