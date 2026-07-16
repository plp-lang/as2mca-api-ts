import { describe, expect, test } from "bun:test";
import { context } from "./ctx";

describe("Представления и данные", () => {
  const ctx = context();

  test("classViewsGet", async () => {
    const { client, sessionId } = ctx;

    const views = await client.classViewsGet(sessionId, "CLIENT");
    expect(views).toBeArray();
    expect(views.length).toBeGreaterThan(1);
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
      expect(v.orderBy === undefined || typeof v.orderBy === "string").toBeTrue();
      expect(v.hints === undefined || typeof v.hints === "string").toBeTrue();
      expect(v.cellStyleScript === undefined || typeof v.cellStyleScript === "string").toBeTrue();
      expect(v.sourceId === undefined || typeof v.sourceId === "string").toBeTrue();
      expect(v.extensionId === undefined || typeof v.extensionId === "string").toBeTrue();
      expect(v.filterMethodShortName === undefined || typeof v.filterMethodShortName === "string").toBeTrue();
      expect(v.filterMethodProperties === undefined || typeof v.filterMethodProperties === "string").toBeTrue();
    });
  });
});
