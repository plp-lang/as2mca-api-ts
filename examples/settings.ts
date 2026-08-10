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

const settings = await client.systemSettingsGet(sessionId);
for (const setting of settings) {
  console.log(setting.name, " = ", setting.value);
}

// Завершаем сессию
await client.sessionDeinit(sessionId);
