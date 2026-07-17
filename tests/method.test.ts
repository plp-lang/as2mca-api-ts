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
});
