import { describe, expect, test } from "bun:test";
import { context } from "./ctx";
import type { Control, Method, MethodParameter, MethodVariable } from "../src/models";

describe("Операции", () => {
  const ctx = context();

  let methods: Method[] = [];
  let controls: Control[] = [];
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

  test("request `methodControlsGet`", async () => {
    const { client, sessionId } = ctx;

    (await Promise.all(methods.map((mth) => client.methodControlsGet(sessionId, mth.id)))).forEach((ctrls) => {
      expect(ctrls).toBeArray();
      controls.push(...ctrls);
    });
  });

  test("validate `Control`", () => {
    controls.forEach((c) => {
      expect(c.id).toBeString();
      expect(c.methodId).toBeString();
      expect(c.qualifier).toBeString();
      expect(c.control).toBeOneOf([
        "FORM",
        "LABEL",
        "TEXT",
        "OBJECT",
        "CHECK",
        "BUTTON",
        "SUBFORM",
        "LINE",
        "MEMO",
        "FRAME",
        "DATE",
        "VARIANT",
        "ARRAY",
        "PANEL",
        "COMBO",
        "NUMBER",
        "DEPEND",
        "TABBED",
        "GRID",
        "GRIDCOL",
        "TABLE",
      ]);
      expect(c.caption).toBeString();
      expect(c.top).toBeString();
      expect(c.left).toBeString();
      expect(c.height).toBeString();
      expect(c.width).toBeString();
      expect(c.tabIndex).toBeString();
      expect(c.position).toBeString();
      expect(c.validateName).toBeString();
      expect(typeof c.parentId).toBeOneOf(["undefined", "string"]);
      expect(typeof c.classId).toBeOneOf(["undefined", "string"]);
      expect(typeof c.depend).toBeOneOf(["undefined", "string"]);
      expect(typeof c.properties).toBeOneOf(["undefined", "string"]);
      expect(typeof c.tips).toBeOneOf(["undefined", "string"]);
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
