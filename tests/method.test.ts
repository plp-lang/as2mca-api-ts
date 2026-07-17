import { describe, expect, test } from "bun:test";
import { context } from "./ctx";
import type { Method, MethodParameter, MethodVariable } from "../src/models";

describe("Операции", () => {
  const ctx = context();

  let methods: Method[] = [];
  let params: MethodParameter[] = [];
  let vars: MethodVariable[] = [];

  test("reqeust `classMethodsGet`", async () => {
    const { client, sessionId } = ctx;

    const mths = await client.classMethodsGet(sessionId, "AC_FIN");
    expect(mths).toBeArray();
    expect(mths.length).toBeGreaterThan(0);
    methods.push(...mths);
  });

  test("validate `Method`", () => {
    methods.forEach((mth) => {
      expect(mth.id).toBeString();
      expect(mth.name).toBeString();
      expect(mth.shortName).toBeString();
      expect(mth.type).toBeOneOf(["C", "G", "M", "R", "S", "Y", "O", "P"]);
      expect(mth.formClassId).toBeString();
      expect(mth.properties).toBeString();
      expect(mth.distance).toBeString();
      expect(typeof mth.callableShortName).toBeOneOf(["string", "undefined"]);
      expect(typeof mth.scriptId).toBeOneOf(["string", "undefined"]);
      expect(typeof mth.resultClassId).toBeOneOf(["string", "undefined"]);
      expect(typeof mth.userDriven).toBeOneOf(["boolean", "undefined"]);
      expect(typeof mth.formId).toBeOneOf(["string", "undefined"]);
      expect(typeof mth.reportType).toBeOneOf(["string", "undefined"]);
      expect(typeof mth.reportTemplate).toBeOneOf(["string", "undefined"]);
    });
  });

  test("request `methodClientScriptGet`", async () => {
    const { client, sessionId } = ctx;

    (await Promise.all(methods.map((mth) => client.methodClientScriptGet(sessionId, mth.id)))).forEach((script) => {
      expect(typeof script).toBeOneOf(["string", "undefined"]);
    });
  });

  test("request `methodParametersGet`", async () => {
    const { client, sessionId } = ctx;

    (await Promise.all(methods.map((mth) => client.methodParametersGet(sessionId, mth.id)))).forEach((prms) => {
      expect(prms).toBeArray();
      params.push(...prms);
    });
  });

  test("validate `MethodParameter`", () => {
    params.forEach((p) => {
      expect(p.shortName).toBeString();
      expect(p.classId).toBeString();
      expect(p.position).toBeString();
      expect(p.referenceType).toBeOneOf(["D", "T", "R"]);
      expect(p.direction).toBeOneOf(["D", "I", "B", "O"]);
      expect(typeof p.viewId).toBeOneOf(["string", "undefined"]);
      expect(typeof p.viewClassId).toBeOneOf(["string", "undefined"]);
      expect(typeof p.viewFilter).toBeOneOf(["string", "undefined"]);
      expect(typeof p.defaultValue).toBeOneOf(["string", "undefined"]);
    });
  });

  test("request `methodVariablesGet`", async () => {
    const { client, sessionId } = ctx;

    (await Promise.all(methods.map((mth) => client.methodVariablesGet(sessionId, mth.id)))).forEach((vrs) => {
      expect(vrs).toBeArray();
      vars.push(...vrs);
    });
  });

  test("validate `MethodParameter`", () => {
    vars.forEach((p) => {
      expect(p.shortName).toBeString();
      expect(p.classId).toBeString();
      expect(p.position).toBeString();
      expect(p.referenceType).toBeOneOf(["D", "T", "R"]);
    });
  });

  test("Создать и удалить экземпляр ::[FP_TUNE]", async () => {
    const { client, sessionId } = ctx;

    const CLASS_SHORT_NAME = "FP_TUNE";
    // const VIEW_SHORT_NAME = "VW_CRIT_FP_TUNE_ALL";
    const METHOD_CREATE_SHORT_NAME = "NEW#AUTO";
    // const METHOD_DELETE_SHORT_NAME = "DELETE#AUTO";

    const methods = await client.classMethodsGet(sessionId, CLASS_SHORT_NAME);
    expect(methods).toBeArray();
    expect(methods.length).toBeGreaterThan(2);

    // Конструктор

    const createMethodId = methods.find((v) => v.shortName === METHOD_CREATE_SHORT_NAME)?.id;
    expect(createMethodId).toBeString();

    const createFrameId = await client.methodBegin(sessionId, createMethodId as string);
    expect(createFrameId).toBeString();

    await client.methodValidateDefault(sessionId, {
      classId: CLASS_SHORT_NAME,
      methodId: createMethodId as string,
    });

    await client.methodValidate(sessionId, {
      methodId: createMethodId as string,
      info: "%PARAM%.P_CODE",
      controlsStates: [{ id: "17_007_818", value: "TEST" }],
    });
    await client.methodValidate(sessionId, {
      methodId: createMethodId as string,
      info: "%PARAM%.P_NAME",
      controlsStates: [{ id: "17_007_820", value: "TEST" }],
    });
    await client.methodValidate(sessionId, {
      methodId: createMethodId as string,
      info: "%PARAM%.P_GROUP_ID",
      controlsStates: [{ id: "17_007_839", value: "TEST" }],
    });
    await client.methodValidate(sessionId, {
      methodId: createMethodId as string,
      info: "%VAR%.V_VAL_TYPE.0",
      controlsStates: [{ id: "17_007_844", value: "4" }],
    });
    await client.methodValidate(sessionId, {
      methodId: createMethodId as string,
      info: "%VAR%.V_VAL_BOOL.0",
      controlsStates: [{ id: "17_007_835", value: "1" }],
    });

    const prevCreateFrameId = await client.methodEnd(sessionId, createFrameId as string);
    expect(prevCreateFrameId).toBeUndefined();

    // Деструктор

    // const deleteMethodId = methods.find((v) => v.shortName === METHOD_DELETE_SHORT_NAME)?.id;
    // expect(deleteMethodId).toBeString();

    // const deleteFrameId = await client.methodBegin(sessionId, deleteMethodId as string);
    // expect(deleteFrameId).toBeString();

    // const prevDeleteFrameId = await client.methodEnd(sessionId, deleteFrameId as string);
    // expect(prevDeleteFrameId).toBeUndefined();
  });
});
