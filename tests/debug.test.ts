import { describe, expect, test } from "bun:test";
import { context } from "./ctx";

describe("Сессия и информация о пользователе", () => {
  const ctx = context();

  test("pipeTextGet", async () => {
    const { client, sessionId, debugPipeName } = ctx;

    const text = await client.pipeTextGet(sessionId, debugPipeName);
    expect(text).toBeString();
  });

  test("debugTextGet", async () => {
    const { client, sessionId } = ctx;

    const text = await client.debugTextGet(sessionId, "B");
    expect(text).toBeString();
  });
});
