import { describe, expect, test } from "bun:test";
import { context } from "./ctx";

describe("Сессия и информация о пользователе", () => {
  const ctx = context();

  test("sessionInit", () => {
    const { debug_pipe_name, session_id } = ctx;

    expect(session_id).toBeDefined();
    expect(session_id).toMatch(/^([0-9a-fA-F]{32}|[\w-]+!\d+!\d+)$/);

    expect(debug_pipe_name).toBeDefined();
    expect(debug_pipe_name).toMatch(/^debug\$\d{10}$/);
  });

  test("systemUserPrivilegedGet", async () => {
    const { client, session_id } = ctx;

    const isPrivileged = await client.systemUserPrivilegedGet(session_id);
    expect(isPrivileged).toBeTrue();
  });

  test("userInfoGet", async () => {
    const { client, session_id } = ctx;

    const userInfo = await client.userInfoGet(session_id);
    expect(userInfo.name).toBeString();
    expect(userInfo.shortName).toBeString();
    expect(userInfo.properties).toBeString();
  });

  test("userProfilePropertyGet", async () => {
    const { client, session_id } = ctx;

    const value = await client.userProfilePropertyGet(session_id, "SESSIONS_PER_USER");
    expect(value).toBe("UNLIMITED");
  });
});
