import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { HealthResponseSchema } from "./health-response";

describe("HealthResponseSchema", () => {
  it("accepts a valid health response", () => {
    const result = v.safeParse(HealthResponseSchema, { status: "ok" });

    expect(result.success).toBe(true);
    expect(result.output).toEqual({ status: "ok" });
  });

  it.each([{ status: "ng" }, { status: "OK" }, {}, { status: 1 }])(
    "rejects an invalid health response: %j",
    (input) => {
      const result = v.safeParse(HealthResponseSchema, input);

      expect(result.success).toBe(false);
    },
  );
});
