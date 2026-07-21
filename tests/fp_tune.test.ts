import { describe, expect, test } from "bun:test";
import { context } from "./ctx";

describe("Создать и удалить экземпляр ::[FP_TUNE]", () => {
  const ctx = context();

  const TEST_OBJECT_VALUE = "AS2MCA_API_TEST_OBJECT";
  const CLASS_SHORT_NAME = "FP_TUNE";
  const VIEW_SHORT_NAME = "VW_CRIT_FP_TUNE_ALL";
  const METHOD_CREATE_SHORT_NAME = "NEW#AUTO";
  const METHOD_DELETE_SHORT_NAME = "DELETE#AUTO";

  let VIEW_ID: string;
  let OBJECT_ID: string;
  let METHOD_CREATE_ID: string;
  let METHOD_DELETE_ID: string;

  test("Поиск необходимых для теста операций и представлений", async () => {
    const { client, sessionId } = ctx;

    const methods = await client.classMethodsGet(sessionId, CLASS_SHORT_NAME);
    expect(methods).toBeArray();
    expect(methods.length).toBeGreaterThan(2);

    const views = await client.classViewsGet(sessionId, CLASS_SHORT_NAME);
    expect(views).toBeArray();
    expect(views.length).toBeGreaterThan(1);

    VIEW_ID = views.find((v) => v.shortName === VIEW_SHORT_NAME)?.id as string;
    expect(VIEW_ID).toBeString();

    METHOD_CREATE_ID = methods.find((v) => v.shortName === METHOD_CREATE_SHORT_NAME)?.id as string;
    expect(METHOD_CREATE_ID).toBeString();

    METHOD_DELETE_ID = methods.find((v) => v.shortName === METHOD_DELETE_SHORT_NAME)?.id as string;
    expect(METHOD_DELETE_ID).toBeString();
  });

  test("Поиск тестового экземпляра, удаляем если нашли", async () => {
    const { client, sessionId } = ctx;

    const data = await client.viewDataGetCancelable(sessionId, {
      classId: CLASS_SHORT_NAME,
      viewShortName: VIEW_SHORT_NAME,
      userFilter: { and: [{ caseInsensitiveFilter: { columnName: "C_2", operator: "=", value: TEST_OBJECT_VALUE } }] },
    });

    expect(data).toBeArray();
    const object = data[0];
    const objectId = object?.find((v) => v.columnName === "ID")?.value as string;
    const objectCode = object?.find((v) => v.columnName === "C_2")?.value as string;

    if (objectCode === TEST_OBJECT_VALUE) {
      const frameId = (await client.methodBegin(sessionId, METHOD_DELETE_ID)) as string;
      expect(frameId).toBeString();
      await client.methodValidateDefault(sessionId, {
        classId: CLASS_SHORT_NAME,
        methodId: METHOD_DELETE_ID,
        objectId: [objectId],
      });
      await client.methodExecute(sessionId, {
        methodId: METHOD_DELETE_ID,
      });
      const prevFrameId = await client.methodEnd(sessionId, frameId);
      expect(prevFrameId).toBeUndefined();
    }
  });

  test("Создаем тестовый экземпляр", async () => {
    const { client, sessionId } = ctx;

    const frameId = (await client.methodBegin(sessionId, METHOD_CREATE_ID)) as string;
    expect(frameId).toBeString();

    await client.methodValidateDefault(sessionId, {
      classId: CLASS_SHORT_NAME,
      methodId: METHOD_CREATE_ID,
    });

    await client.methodValidate(sessionId, {
      methodId: METHOD_CREATE_ID,
      info: "%PARAM%.P_CODE",
      controlsStates: [{ id: "17007818", value: TEST_OBJECT_VALUE }],
    });

    await client.methodValidate(sessionId, {
      methodId: METHOD_CREATE_ID,
      info: "%PARAM%.P_NAME",
      controlsStates: [{ id: "17007820", value: TEST_OBJECT_VALUE }],
    });

    await client.methodValidate(sessionId, {
      methodId: METHOD_CREATE_ID,
      info: "%PARAM%.P_GROUP_ID",
      controlsStates: [{ id: "17007839", value: TEST_OBJECT_VALUE }],
    });

    await client.methodValidate(sessionId, {
      methodId: METHOD_CREATE_ID,
      info: "%VAR%.V_VAL_TYPE.0",
      controlsStates: [{ id: "17007844", value: "4" }],
    });

    await client.methodValidate(sessionId, {
      methodId: METHOD_CREATE_ID,
      info: "%VAR%.V_VAL_BOOL.0",
      controlsStates: [{ id: "17007835", value: "1" }],
    });

    const { value: objectId } = await client.methodExecute(sessionId, { methodId: METHOD_CREATE_ID });
    expect(objectId).toBeString();
    OBJECT_ID = objectId as string;

    const prevFrameId = await client.methodEnd(sessionId, frameId);
    expect(prevFrameId).toBeUndefined();
  });

  test("Проверяем наличие созданого тестового экземпляра", async () => {
    const { client, sessionId } = ctx;

    const data = await client.viewDataGetCancelable(sessionId, {
      classId: CLASS_SHORT_NAME,
      viewShortName: VIEW_SHORT_NAME,
      objectIdFilter: OBJECT_ID,
    });
    expect(data).toBeArray();
    expect(data).toHaveLength(1);
    expect(data[0]?.find((v) => v.columnName === "C_2")?.value).toBe(TEST_OBJECT_VALUE);
  });

  test("Блокируем тестовый экземпляр", async () => {
    const { client, sessionId } = ctx;

    const msg = await client.objectsLock(sessionId, [{ classId: CLASS_SHORT_NAME, id: OBJECT_ID }]);
    expect(msg).toBeUndefined();
  });

  test("Удаляем тестовый экземпляр", async () => {
    const { client, sessionId } = ctx;

    const frameId = (await client.methodBegin(sessionId, METHOD_DELETE_ID)) as string;
    expect(frameId).toBeString();
    await client.methodValidateDefault(sessionId, {
      classId: CLASS_SHORT_NAME,
      methodId: METHOD_DELETE_ID,
      objectId: [OBJECT_ID],
    });
    await client.methodExecute(sessionId, {
      methodId: METHOD_DELETE_ID,
    });
    const prevFrameId = await client.methodEnd(sessionId, frameId);
    expect(prevFrameId).toBeUndefined();
  });

  test("Снимаем блокировку с экземпляра", async () => {
    const { client, sessionId } = ctx;
    await client.objectsUnlock(sessionId);
  });
});
