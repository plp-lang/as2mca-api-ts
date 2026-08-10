import { describe, expect, test } from "bun:test";

import { context } from "./ctx";
import type { Class, Column, View } from "../src/models";

describe("Представления и колонки", () => {
  const ctx = context();

  let classes: Class[] = [];
  let views: View[] = [];
  let columns: Column[] = [];

  test("request `classesGet`", async () => {
    const { client, sessionId } = ctx;

    const cls = await client.classesGet(sessionId, ["USER", "DOCUMENT", "CL_PRIV", "CL_ORG"]);
    expect(cls).toBeArray();
    expect(cls.length).toBeGreaterThan(0);
    classes.push(...cls);
  });

  test("request `classViewsGet`", async () => {
    const { client, sessionId } = ctx;

    (await Promise.all(classes.map((cl) => client.classViewsGet(sessionId, cl.id)))).forEach((vws) => {
      expect(vws).toBeArray();
      expect(vws.length).toBeGreaterThan(0);
      views.push(...vws);
    });
  });

  test("validate `View`", () => {
    views.forEach((v) => {
      expect(v.id).toBeString();
      expect(v.name).toBeString();
      expect(v.shortName).toBeString();
      expect(v.isDefault).toBeBoolean();
      expect(v.properties).toBeString();
      expect(v.distance).toBeString();
      expect(v.objectRights).toBeString();
      expect(v.toPrinter).toBeBoolean();
      expect(v.toFile).toBeBoolean();
      expect(typeof v.orderBy).toBeOneOf(["string", "undefined"]);
      expect(typeof v.hints).toBeOneOf(["string", "undefined"]);
      expect(typeof v.cellStyleScript).toBeOneOf(["string", "undefined"]);
      expect(typeof v.sourceId).toBeOneOf(["string", "undefined"]);
      expect(typeof v.extensionId).toBeOneOf(["string", "undefined"]);
      expect(typeof v.filterMethodShortName).toBeOneOf(["string", "undefined"]);
      expect(typeof v.filterMethodProperties).toBeOneOf(["string", "undefined"]);
    });
  });

  test("request `viewColumnsGet`", async () => {
    const { client, sessionId } = ctx;

    (await Promise.all(views.map((view) => client.viewColumnsGet(sessionId, view.id)))).forEach((clms) => {
      expect(clms).toBeArray();
      expect(clms.length).toBeGreaterThan(0);
      columns.push(...clms);
    });
  });

  test("validate `Column`", () => {
    columns.forEach((v) => {
      expect(v.name).toBeString();
      expect(v.width).toBeString();
      expect(v.align).toBeOneOf(["0", "1", "2"]);
      expect(v.position).toBeString();
      expect(v.qual).toBeString();
      expect(v.alias).toBeString();
      expect(v.base).toBeOneOf([
        "MEMO",
        "DATE",
        "STRING",
        "NUMBER",
        "BOOLEAN",
        "REFERENCE",
        "COLLECTION",
        "OLE",
        "NULL",
        "STATE",
      ]);
      expect(v.isSizeable).toBeBoolean();
      expect(v.isInvisible).toBeOneOf(["0", "1", "2"]);
      expect(v.abilityPerformOperation).toBeBoolean();
      expect(typeof v.isCellStyle).toBeOneOf(["boolean", "undefined"]);
      expect(typeof v.isEditable).toBeOneOf(["boolean", "undefined"]);
      expect(typeof v.referenceId).toBeOneOf(["string", "undefined"]);
      expect(typeof v.targetClassId).toBeOneOf(["string", "undefined"]);
      expect(typeof v.referenceType).toBeOneOf(["string", "undefined"]);
      expect(v.logging).toBeOneOf([undefined, "0", "1", "D"]);
    });
  });
});
