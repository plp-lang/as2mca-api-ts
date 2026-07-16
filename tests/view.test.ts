import { describe, expect, test } from "bun:test";

import { context } from "./ctx";

import type { Class, Column, View } from "../src/models";

describe("Представления и данные", () => {
  const ctx = context();

  let classes: Class[] = [];
  let views: View[] = [];
  let columns: Column[] = [];

  test("request `classesGet`", async () => {
    const { client, sessionId } = ctx;

    const new_classes = await client.classesGet(sessionId, ["USER", "DOCUMENT", "CL_PRIV", "CL_ORG"]);
    expect(new_classes).toBeArray();
    expect(new_classes.length).toBeGreaterThan(0);
    classes.push(...new_classes);
  });

  test("request `classViewsGet`", async () => {
    const { client, sessionId } = ctx;

    for (const cl of classes) {
      const new_views = await client.classViewsGet(sessionId, cl.id);
      expect(new_views).toBeArray();
      expect(new_views.length).toBeGreaterThan(0);
      views.push(...new_views);
    }
  });

  test("validate `View`", () => {
    for (const v of views) {
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
    }
  });

  test("request `viewColumnsGet`", async () => {
    const { client, sessionId } = ctx;
    for (const view of views) {
      const new_columns = await client.viewColumnsGet(sessionId, view.id);
      expect(new_columns).toBeArray();
      expect(new_columns.length).toBeGreaterThan(0);
      columns.push(...new_columns);
    }
  });

  test("validate `Column`", () => {
    for (const v of columns) {
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
      expect(v.isCellStyle).toBeBoolean();
      expect(v.isInvisible).toBeOneOf(["0", "2"]);
      expect(v.abilityPerformOperation).toBeBoolean();
      expect(typeof v.isEditable).toBeOneOf(["boolean", "undefined"]);
      expect(typeof v.referenceId).toBeOneOf(["string", "undefined"]);
      expect(typeof v.targetClassId).toBeOneOf(["string", "undefined"]);
      expect(typeof v.referenceType).toBeOneOf(["string", "undefined"]);
      expect(v.logging).toBeOneOf([undefined, "0", "D"]);
    }
  });
});
