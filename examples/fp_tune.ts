import { Client } from "../src";

// ---

const URL = Bun.env["AS2MCA_API_URL"] ?? "http://localhost:3000/platform2mca/";
const USERNAME = Bun.env["AS2MCA_API_USERNAME"] ?? "test";
const PASSWORD = Bun.env["AS2MCA_API_PASSWORD"] ?? "test";

// ---

const client = new Client(URL);

// Авторизация и инициализация сессии
await client.authbasic(USERNAME, PASSWORD);
const { sessionId } = await client.sessionInit();

// Получаем список всех операций ТБП `::[FP_TUNE]`
const classShortName = "FP_TUNE";
const methods = await client.classMethodsGet(sessionId, classShortName);

// Получаем `id` операции `::[FP_TUNE].[NEW#AUTO]`
const methodShortName = "NEW#AUTO";
const methodId = methods.find((v) => v.shortName === methodShortName)?.id;
if (!methodId) throw Error(`"Операция ${methodShortName} не найдена!"`);

// Открываем форму и вызываем блок `validate` по умолчанию
const frameId = await client.methodBegin(sessionId, methodId);
if (!frameId) throw Error(`Не удалось открыть операцию ${methodShortName}`);
await client.methodValidateDefault(sessionId, {
  classId: classShortName,
  methodId,
});

// Заполняем элемент формы "Группа", вызывая блок `validate` с соответсвующим `P_INFO`
await client.methodValidate(sessionId, {
  methodId,
  info: "%PARAM%.P_GROUP_ID",
  controlsStates: [{ id: "17007839", value: "AS2MCA_TEST_GROUP" }],
});

// Заполняем элемент формы "Наименование", вызывая блок `validate` с соответсвующим `P_INFO`
await client.methodValidate(sessionId, {
  methodId,
  info: "%PARAM%.P_NAME",
  controlsStates: [{ id: "17007820", value: "Тестовая настройка" }],
});

// Заполняем элемент формы "Код", вызывая блок `validate` с соответсвующим `P_INFO`
await client.methodValidate(sessionId, {
  methodId,
  info: "%PARAM%.P_CODE",
  controlsStates: [{ id: "17007818", value: "AS2MCA_TEST_CODE" }],
});

// Выбираем тип значения как "Логика", вызывая блок `validate` с соответсвующим `P_INFO`
await client.methodValidate(sessionId, {
  methodId,
  info: "%VAR%.V_VAL_TYPE.0",
  controlsStates: [{ id: "17007844", value: "4" }],
});

// Уставливаем значение, вызывая блок `validate` с соответсвующим `P_INFO`
await client.methodValidate(sessionId, {
  methodId,
  info: "%VAR%.V_VAL_BOOL.0",
  controlsStates: [{ id: "17007835", value: "1" }],
});

// Выполняем операцию, нажатие на кнопку "ОК" и закрытие формы
const { value: objectId } = await client.methodExecute(sessionId, { methodId });
await client.methodEnd(sessionId, frameId);

// Печатаем в консоль `id` созданной настройки.
console.log("Была успешно добавлена новая настройка в `::[FP_TUNE]` с `id` = ", objectId);

// Завершаем сессию
await client.sessionDeinit(sessionId);

// const { value: objectId } = await client.methodExecute(sessionId, {
//   methodId,
//   controlsStates: [
//     { id: "17007839", value: "AS2MCA_TEST_GROUP" },
//     { id: "17007820", value: "Тестовая настройка" },
//     { id: "17007818", value: "AS2MCA_TEST_CODE" },
//     { id: "17007864", value: "BOOLEAN" },
//     { id: "17007835", value: "1" }
//   ],
// });

// await client.methodValidate(sessionId, {
//   methodId,
//   info: "%PLPCALL%",
//   plpCallParameters: [
//     {
//       target: [{ parameter: { methodId, name: "P_GROUP_ID" }}],
//       source: [{ constant: { value: "AS2MCA_TEST_GROUP" }}],
//     },
//     {
//       target: [{ parameter: { methodId, name: "P_NAME" }}],
//       source: [{ constant: { value: "Тестовая настройка" }}],
//     },
//     {
//       target: [{ parameter: { methodId, name: "P_CODE" }}],
//       source: [{ constant: { value: "AS2MCA_TEST_CODE" }}],
//     },
//     {
//       target: [{ parameter: { methodId, name: "P_VAL_TYPE" }}],
//       source: [{ constant: { value: "BOOLEAN" }}],
//     },
//     {
//       target: [{ parameter: { methodId, name: "P_VALUES" }}],
//       source: [{ constant: { value: "45543423508" }}],
//     },
//   ]
// });

// const { value: objectId } = await client.methodExecute(sessionId, { methodId });