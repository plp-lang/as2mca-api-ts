import { describe, expect, test } from "bun:test";
import { context } from "./ctx";

describe("Операции", () => {
  const ctx = context();

  test("classMethodsGet", async () => {
    const { client, sessionId } = ctx;

    const methods = await client.classMethodsGet(sessionId, "DOCUMENT");
    expect(methods).toBeArray();
    expect(methods.length).toBeGreaterThan(1);
    methods.forEach((mth) => {
      expect(mth.id).toBeString();
      expect(mth.name).toBeString();
      expect(mth.shortName).toBeString();
      expect(mth.type).toBeOneOf(["C", "G", "M", "R", "S", "Y", "O"]);
      expect(mth.formClassId).toBeString();
      expect(mth.properties).toBeString();
      expect(mth.distance).toBeString();
      expect(mth.callableShortName === undefined || typeof mth.callableShortName === "string").toBe(true);
      expect(mth.scriptId === undefined || typeof mth.scriptId === "string").toBe(true);
      expect(mth.resultClassId === undefined || typeof mth.resultClassId === "string").toBe(true);
      expect(mth.userDriven === undefined || typeof mth.userDriven === "boolean").toBe(true);
      expect(mth.formId === undefined || typeof mth.formId === "string").toBe(true);
      expect(mth.reportType === undefined || typeof mth.reportType === "string").toBe(true);
      expect(mth.reportTemplate === undefined || typeof mth.reportTemplate === "string").toBe(true);
    });
  });

  test("methodClientScriptGet", async () => {
    const { client, sessionId } = ctx;

    const CLASS_SHORT_NAME = "CL_PRIV";
    const METHOD_SHORT_NAME = "EDIT#AUTO";

    const methods = await client.classMethodsGet(sessionId, CLASS_SHORT_NAME);
    expect(methods).toBeArray();
    expect(methods.length).toBeGreaterThan(1);

    const methodId = methods.find((v) => v.shortName === METHOD_SHORT_NAME)?.id;
    expect(methodId).toBeString();

    const script = await client.methodClientScriptGet(sessionId, methodId as string);
    expect(script).toBeString();
  });

  test("Создать и удалить экземпляр ::[FP_TUNE]", async () => {
    const { client, sessionId } = ctx;

    const CLASS_SHORT_NAME = "FP_TUNE";
    // const VIEW_SHORT_NAME = "VW_CRIT_FP_TUNE_ALL";
    const METHOD_CREATE_SHORT_NAME = "NEW#AUTO";
    const METHOD_DELETE_SHORT_NAME = "DELETE#AUTO";

    const methods = await client.classMethodsGet(sessionId, CLASS_SHORT_NAME);
    expect(methods).toBeArray();
    expect(methods.length).toBeGreaterThan(2);

    const creteMethodId = methods.find((v) => v.shortName === METHOD_CREATE_SHORT_NAME)?.id;
    expect(creteMethodId).toBeString();
    const deleteMethodId = methods.find((v) => v.shortName === METHOD_DELETE_SHORT_NAME)?.id;
    expect(deleteMethodId).toBeString();

    // Конструктор
    const createFrameId = await client.methodBegin(sessionId, creteMethodId as string);
    expect(createFrameId).toBeString();

    const prevCreateFrameId = await client.methodEnd(sessionId, createFrameId as string);
    expect(prevCreateFrameId).toBeUndefined();

    // Деструктор
    const deleteFrameId = await client.methodBegin(sessionId, deleteMethodId as string);
    expect(deleteFrameId).toBeString();

    const prevDeleteFrameId = await client.methodEnd(sessionId, deleteFrameId as string);
    expect(prevDeleteFrameId).toBeUndefined();
  });
});
