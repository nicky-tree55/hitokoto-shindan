import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import {
  DiagnoseRequestSchema,
  DiagnoseResponseSchema,
  DiagnosisTypeSchema,
  parseDiagnoseRequest,
  parseDiagnoseResponse,
} from "./diagnose";

const validType = {
  id: "type-1",
  genreId: "personality",
  name: "情熱的リーダー型",
  description: "周囲を巻き込みながら前進するタイプ。",
};

describe("DiagnoseRequestSchema", () => {
  it("accepts a valid diagnose request", () => {
    const result = v.safeParse(DiagnoseRequestSchema, {
      answers: [{ questionId: "q1", answerId: "a1" }],
    });

    expect(result.success).toBe(true);
  });

  it("accepts an empty answers array", () => {
    expect(v.safeParse(DiagnoseRequestSchema, { answers: [] }).success).toBe(true);
  });

  it.each([{}, { answers: [{ questionId: "q1" }] }, { answers: "not-an-array" }])(
    "rejects an invalid diagnose request: %j",
    (input) => {
      expect(v.safeParse(DiagnoseRequestSchema, input).success).toBe(false);
    },
  );
});

describe("parseDiagnoseRequest", () => {
  it("returns the parsed value for a valid input", () => {
    const input = { answers: [{ questionId: "q1", answerId: "a1" }] };

    expect(parseDiagnoseRequest(input)).toEqual(input);
  });

  it("throws for an invalid input", () => {
    expect(() => parseDiagnoseRequest({ answers: [{ questionId: "q1" }] })).toThrow();
  });
});

describe("DiagnosisTypeSchema", () => {
  it("accepts a valid type", () => {
    expect(v.safeParse(DiagnosisTypeSchema, validType).success).toBe(true);
  });
});

describe("DiagnoseResponseSchema", () => {
  it("accepts a valid diagnose response", () => {
    const result = v.safeParse(DiagnoseResponseSchema, { type: validType, score: 3 });

    expect(result.success).toBe(true);
  });

  it("rejects a response with a non-numeric score", () => {
    const result = v.safeParse(DiagnoseResponseSchema, { type: validType, score: "3" });

    expect(result.success).toBe(false);
  });
});

describe("parseDiagnoseResponse", () => {
  it("returns the parsed value for a valid input", () => {
    const input = { type: validType, score: 3 };

    expect(parseDiagnoseResponse(input)).toEqual(input);
  });

  it("throws for an invalid input", () => {
    expect(() => parseDiagnoseResponse({ type: validType, score: "3" })).toThrow();
  });
});
