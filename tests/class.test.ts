import { describe, expect, test } from "bun:test";
import { context } from "./ctx";
import type { Class } from "../src/models";

describe("ТБП и типы", () => {
  const ctx = context();

  test("objectClassAndArchiveKeyGet", async () => {
    const { client, sessionId } = ctx;

    const { classId, archiveKey } = await client.objectClassAndArchiveKeyGet(sessionId, 0, "USER");
    expect(typeof classId).toBeOneOf(["undefined", "string"]);
    expect(typeof archiveKey).toBeOneOf(["undefined", "string"]);
  });

  test("objectBackwardReferencesGet", async () => {
    const { client, sessionId } = ctx;

    const refs = await client.objectBackwardReferencesGet(sessionId, 8_935_328, "USER");
    expect(refs).toBeArray();
    expect(refs.length).toBeGreaterThan(0);
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
      expect(typeof methodShortName).toBeOneOf(["string", "undefined"]);
      expect(initialStateID).toBeString();
      expect(finalStateID).toBeString();
    });
  });

  test("classStatesGet", async () => {
    const { client, sessionId } = ctx;

    const states = await client.classStatesGet(sessionId, "VZ_CARDS");
    expect(states).toBeArray();
    expect(states.length).toBeGreaterThan(1);
    states.forEach(({ id, name, indexUse }): void => {
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
      expect(typeof cl.menuCaption).toBeOneOf(["string", "undefined"]);
      expect(typeof cl.isAccessible).toBeOneOf(["boolean", "undefined"]);
      expect(typeof cl.padLength).toBeOneOf(["string", "undefined"]);
      expect(typeof cl.dataSize).toBeOneOf(["string", "undefined"]);
      expect(typeof cl.dataPrecision).toBeOneOf(["string", "undefined"]);
      expect(typeof cl.properties).toBeOneOf(["string", "undefined"]);
      expect(typeof cl.groupId).toBeOneOf(["string", "undefined"]);
    });
  });

  test("classGet", async () => {
    const { client, sessionId } = ctx;

    const cl = (await client.classGet(sessionId, "DOCUMENT")) as Class;
    expect(cl).toBeDefined();
    expect(cl.id).toBeString();
    expect(cl.name).toBeString();
    expect(cl.baseClassId).toBe("STRUCTURE");
    expect(cl.entityId).toBeString();
    expect(cl.isKernelType).toBeBoolean();
    expect(cl.classInterface).toBeString();
    expect(cl.flags).toBeString();
    expect(typeof cl.menuCaption).toBeOneOf(["string", "undefined"]);
    expect(typeof cl.isAccessible).toBeOneOf(["boolean", "undefined"]);
    expect(typeof cl.padLength).toBeOneOf(["string", "undefined"]);
    expect(typeof cl.dataSize).toBeOneOf(["string", "undefined"]);
    expect(typeof cl.dataPrecision).toBeOneOf(["string", "undefined"]);
    expect(typeof cl.properties).toBeOneOf(["string", "undefined"]);
    expect(typeof cl.groupId).toBeOneOf(["string", "undefined"]);
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
      expect(typeof cl.menuCaption).toBeOneOf(["string", "undefined"]);
      expect(typeof cl.isAccessible).toBeOneOf(["boolean", "undefined"]);
      expect(typeof cl.padLength).toBeOneOf(["string", "undefined"]);
      expect(typeof cl.dataSize).toBeOneOf(["string", "undefined"]);
      expect(typeof cl.dataPrecision).toBeOneOf(["string", "undefined"]);
      expect(typeof cl.properties).toBeOneOf(["string", "undefined"]);
      expect(typeof cl.groupId).toBeOneOf(["string", "undefined"]);
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
      expect(typeof cl.menuCaption).toBeOneOf(["string", "undefined"]);
      expect(typeof cl.isAccessible).toBeOneOf(["boolean", "undefined"]);
      expect(typeof cl.padLength).toBeOneOf(["string", "undefined"]);
      expect(typeof cl.dataSize).toBeOneOf(["string", "undefined"]);
      expect(typeof cl.dataPrecision).toBeOneOf(["string", "undefined"]);
      expect(typeof cl.properties).toBeOneOf(["string", "undefined"]);
      expect(typeof cl.groupId).toBeOneOf(["string", "undefined"]);
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
