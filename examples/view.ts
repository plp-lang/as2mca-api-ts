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

// Получаем 5 первых строк представления `::[USER].[VW_CRIT_USER]`
const rows = await client.viewDataGetCancelable(sessionId, {
  viewShortName: "VW_CRIT_USER",
  classId: "USER",
  rowsLimit: 5,
});

// Печатаем данные в консоль
for (const row of rows) {
  for (const column of row) {
    console.log(column.columnName, " = ", column.value);
  }
  console.log("---");
}

// Завершаем сессию
await client.sessionDeinit(sessionId);
