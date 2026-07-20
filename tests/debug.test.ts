import { describe, expect, test } from "bun:test";
import { context } from "./ctx";

describe("Отладка", () => {
  const ctx = context();

  test("pipeTextGet", async () => {
    const { client, sessionId, debugPipeName } = ctx;

    const text = await client.pipeTextGet(sessionId, debugPipeName);
    expect(typeof text).toBeOneOf(["undefined", "string"]);
  });

  test("debugTextGet", async () => {
    const { client, sessionId } = ctx;

    const text = await client.debugTextGet(sessionId, "B");
    expect(typeof text).toBeOneOf(["undefined", "string"]);
  });
});
