import { describe, expect, test } from "bun:test";
import { context } from "./ctx";

describe("ТБП и типы", () => {
  const ctx = context();

  test("objectClassAndArchiveKeyGet", async () => {
    const { client, sessionId } = ctx;

    const { classId, archiveKey } = await client.objectClassAndArchiveKeyGet(sessionId, 0, "DOCUMENT");
    expect(classId === undefined || typeof archiveKey === "string").toBe(true);
    expect(classId === undefined || typeof archiveKey === "string").toBe(true);
  });

  test("objectBackwardReferencesGet", async () => {
    const { client, sessionId } = ctx;

    const refs = await client.objectBackwardReferencesGet(sessionId, 0, "DOCUMENT");
    expect(refs).toBeArray()
    refs.forEach(({ classId, className, qual, qualName }): void => {
      expect(classId).toBeString();
      expect(className).toBeString();
      expect(qual).toBeString();
      expect(qualName).toBeString();
    });
  });

  test("classTransitionsGet", async () => {
    const { client, sessionId } = ctx;

    const trans = await client.classTransitionsGet(sessionId, "VZ_CARDS");
    expect(trans).toBeArray();
    expect(trans.length).toBeGreaterThan(1);
    trans.forEach(({ id, name, methodShortName, initialStateID, finalStateID }): void => {
      expect(id).toBeString();
      expect(name).toBeString();
      expect(methodShortName === undefined || typeof methodShortName === "string").toBe(true);;
      expect(initialStateID).toBeString();
      expect(finalStateID).toBeString();
    });
  });

  test("classStatesGet", async () => {
    const { client, sessionId } = ctx;

    const trans = await client.classStatesGet(sessionId, "VZ_CARDS");
    expect(trans).toBeArray();
    expect(trans.length).toBeGreaterThan(1);
    trans.forEach(({ id, name, indexUse }): void => {
      expect(id).toBeString();
      expect(name).toBeString();
      expect(indexUse).toBeString();
    });
  });

  test("classNeedCollectionIdCheck", async () => {
    const { client, sessionId } = ctx;

    const isNeed = await client.classNeedCollectionIdCheck(sessionId, "DOCUMENT");
    expect(isNeed).toBeFalse();
  });

  test("classChildrenGet", async () => {
    const { client, sessionId } = ctx;

    const childs = await client.classChildrenGet(sessionId, "DOCUMENT");
    expect(childs).toBeArray();
    expect(childs.length).toBeGreaterThan(1);
    childs.forEach(({ id }) => {
      expect(id).toBeString();
    });
  });
});
