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
    expect(refs).toBeArray();
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
      expect(methodShortName === undefined || typeof methodShortName === "string").toBe(true);
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

  test("classesGet", async () => {
    const { client, sessionId } = ctx;

    const cls = await client.classesGet(sessionId, ["DOCUMENT", "CLIENT"]);
    expect(cls).toBeArray();
    expect(cls).toHaveLength(2);
    cls.forEach((cl) => {
      expect(cl.id).toBeString();
      expect(cl.name).toBeString();
      expect(cl.baseClassId).toBe("STRUCTURE");
      expect(cl.entityId).toBeString();
      expect(cl.isKernelType).toBeBoolean();
      expect(cl.classInterface).toBeString();
      expect(cl.flags).toBeString();
      expect(cl.menuCaption === undefined || typeof cl.menuCaption === "string").toBe(true);
      expect(cl.isAccessible === undefined || typeof cl.isAccessible === "boolean").toBe(true);
      expect(cl.padLength === undefined || typeof cl.padLength === "string").toBe(true);
      expect(cl.dataSize === undefined || typeof cl.dataSize === "string").toBe(true);
      expect(cl.dataPrecision === undefined || typeof cl.dataPrecision === "string").toBe(true);
      expect(cl.properties === undefined || typeof cl.properties === "string").toBe(true);
      expect(cl.groupId === undefined || typeof cl.groupId === "string").toBe(true);
    });
  });

  test("classGet", async () => {
    const { client, sessionId } = ctx;

    const cl = await client.classGet(sessionId, "DOCUMENT");
    expect(cl).toBeDefined();
    if (cl !== undefined) {
      expect(cl.id).toBeString();
      expect(cl.name).toBeString();
      expect(cl.baseClassId).toBe("STRUCTURE");
      expect(cl.entityId).toBeString();
      expect(cl.isKernelType).toBeBoolean();
      expect(cl.classInterface).toBeString();
      expect(cl.flags).toBeString();
      expect(cl.menuCaption === undefined || typeof cl.menuCaption === "string").toBe(true);
      expect(cl.isAccessible === undefined || typeof cl.isAccessible === "boolean").toBe(true);
      expect(cl.padLength === undefined || typeof cl.padLength === "string").toBe(true);
      expect(cl.dataSize === undefined || typeof cl.dataSize === "string").toBe(true);
      expect(cl.dataPrecision === undefined || typeof cl.dataPrecision === "string").toBe(true);
      expect(cl.properties === undefined || typeof cl.properties === "string").toBe(true);
      expect(cl.groupId === undefined || typeof cl.groupId === "string").toBe(true);
    }
  });

  test("guidesGet", async () => {
    const { client, sessionId } = ctx;

    const cls = await client.guidesGet(sessionId);
    expect(cls).toBeArray();
    expect(cls.length).toBeGreaterThan(1);
    cls.forEach((cl) => {
      expect(cl.id).toBeString();
      expect(cl.name).toBeString();
      expect(cl.baseClassId).toBe("STRUCTURE");
      expect(cl.entityId).toBeString();
      expect(cl.isKernelType).toBeBoolean();
      expect(cl.classInterface).toBeString();
      expect(cl.flags).toBeString();
      expect(cl.menuCaption === undefined || typeof cl.menuCaption === "string").toBe(true);
      expect(cl.isAccessible === undefined || typeof cl.isAccessible === "boolean").toBe(true);
      expect(cl.padLength === undefined || typeof cl.padLength === "string").toBe(true);
      expect(cl.dataSize === undefined || typeof cl.dataSize === "string").toBe(true);
      expect(cl.dataPrecision === undefined || typeof cl.dataPrecision === "string").toBe(true);
      expect(cl.properties === undefined || typeof cl.properties === "string").toBe(true);
      expect(cl.groupId === undefined || typeof cl.groupId === "string").toBe(true);
    });
  });

  test("typesGet", async () => {
    const { client, sessionId } = ctx;

    const cls = await client.typesGet(sessionId);
    expect(cls).toBeArray();
    expect(cls.length).toBeGreaterThan(1);
    cls.forEach((cl) => {
      expect(cl.id).toBeString();
      expect(cl.name).toBeString();
      expect(cl.baseClassId).toBe("STRUCTURE");
      expect(cl.entityId).toBeString();
      expect(cl.isKernelType).toBeBoolean();
      expect(cl.classInterface).toBeString();
      expect(cl.flags).toBeString();
      expect(cl.menuCaption === undefined || typeof cl.menuCaption === "string").toBe(true);
      expect(cl.isAccessible === undefined || typeof cl.isAccessible === "boolean").toBe(true);
      expect(cl.padLength === undefined || typeof cl.padLength === "string").toBe(true);
      expect(cl.dataSize === undefined || typeof cl.dataSize === "string").toBe(true);
      expect(cl.dataPrecision === undefined || typeof cl.dataPrecision === "string").toBe(true);
      expect(cl.properties === undefined || typeof cl.properties === "string").toBe(true);
      expect(cl.groupId === undefined || typeof cl.groupId === "string").toBe(true);
    });
  });

  test("guidesGroupsGet", async () => {
    const { client, sessionId } = ctx;

    const cls = await client.guidesGroupsGet(sessionId);
    expect(cls).toBeArray();
    expect(cls.length).toBeGreaterThan(1);
    cls.forEach((cl) => {
      expect(cl.id).toBeString();
      expect(cl.name).toBeString();
    });
  });
});
