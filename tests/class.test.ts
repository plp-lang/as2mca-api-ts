import { describe, expect, test } from "bun:test";
import { context } from "./ctx";

describe("ТБП и типы", () => {
  const ctx = context();

  test("objectClassAndArchiveKeyGet", async () => {
    const { client, sessionId } = ctx;

    const object = await client.objectClassAndArchiveKeyGet(sessionId, 0, "DOCUMENT");
    expect(object.classId).toBeString();
    expect(object.archiveKey).toBeString();
  });
});
