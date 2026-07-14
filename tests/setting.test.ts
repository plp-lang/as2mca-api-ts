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
    const { client, sessionId } = ctx;

    const version = await client.systemServerVersionGet(sessionId);
    expect(version).toBeString();
  });

  test("systemSettingsGet", async () => {
    const { client, sessionId } = ctx;

    const settings = await client.systemSettingsGet(sessionId);
    expect(settings).toBeArray();
    settings.forEach(({ name, value }) => {
      expect(name).toBeString();
      expect(value === undefined || typeof value === "string").toBe(true);
    });
  });

  test("systemSettingGet", async () => {
    const { client, sessionId } = ctx;

    const res = await client.systemSettingGet(sessionId, "SHOW_SYSTEM_MENU");
    expect(res).toBe("YES");
  });

  test("authenticationUrlGet", async () => {
    const { client } = ctx;

    const url = await client.authenticationUrlGet();
    expect(url).toBeString();
  });

  test("novoAllowedCheck", async () => {
    const { client, sessionId } = ctx;

    const isCheck = await client.novoAllowedCheck(sessionId);
    expect(isCheck).toBeTrue();
  });

  test("systemOptionEnabledCheck", async () => {
    const { client, sessionId } = ctx;

    const isEnabled = await client.systemOptionEnabledCheck(sessionId, "NAV_SKIN_INTERFACE");
    expect(isEnabled).toBeTrue();
  });
});
