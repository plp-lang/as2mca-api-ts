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

  test("objectBackwardReferencesGet", async () => {
    const { client, sessionId } = ctx;

    const refs = await client.objectBackwardReferencesGet(sessionId, 0, "DOCUMENT");
    refs.forEach(({ classId, className, qual, qualName }): void => {
      expect(classId).toBeString();
      expect(className).toBeString();
      expect(qual).toBeString();
      expect(qualName).toBeString();
    });
  });
});
