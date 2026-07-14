import { describe, expect, test } from "bun:test";
import { context } from "./ctx";

describe("Информация о системе", () => {
  const ctx = context();

  test("protocolInfoGet", async () => {
    const { client } = ctx;

    const version = await client.protocolInfoGet();
    expect(version).toBeString();
  });

  test("systemServerVersionGet", async () => {
    const { client, session_id } = ctx;

    const version = await client.systemServerVersionGet(session_id);
    expect(version).toBeString();
  });

  test("systemSettingsGet", async () => {
    const { client, session_id } = ctx;

    const settings = await client.systemSettingsGet(session_id);
    expect(settings).toBeArray();
    settings.forEach(({ name, value }) => {
      expect(name).toBeString();
      expect(value === undefined || typeof value === "string").toBe(true);
    });
  });

  test("systemSettingGet", async () => {
    const { client, session_id } = ctx;

    const res = await client.systemSettingGet(session_id, "SHOW_SYSTEM_MENU");
    expect(res).toBe("YES");
  });

  test("authenticationUrlGet", async () => {
    const { client } = ctx;

    const url = await client.authenticationUrlGet();
    expect(url).toBeString();
  });

  test("novoAllowedCheck", async () => {
    const { client, session_id } = ctx;

    const isCheck = await client.novoAllowedCheck(session_id);
    expect(isCheck).toBeTrue();
  });
});
