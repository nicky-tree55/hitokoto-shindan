import { describe, expect, it } from "bun:test";
import { createAnswer } from "./answer";

describe("createAnswer", () => {
  it("creates an Answer with trimmed fields", () => {
    const answer = createAnswer({ id: " a1 ", text: " はい ", typeId: " leader " });

    expect(answer).toEqual({ id: "a1", text: "はい", typeId: "leader" });
  });

  it.each([
    ["id", { id: "  ", text: "はい", typeId: "leader" }],
    ["text", { id: "a1", text: "  ", typeId: "leader" }],
    ["typeId", { id: "a1", text: "はい", typeId: "  " }],
  ] as const)("throws when %s is empty", (field, input) => {
    expect(() => createAnswer(input)).toThrow(`Answer.${field} must not be empty`);
  });
});
