import { describe, expect, test } from "bun:test";
import { context } from "./ctx";
import type { ApiError } from "../src";

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

  test("systemCoreInfoGet", async () => {
    const { client, sessionId } = ctx;

    const core = await client.systemCoreInfoGet(sessionId);
    expect(core.auditor).toBeString();
    expect(core.owner).toBeString();
    expect(core.version).toBeString();
    expect(core.build).toBeString();
    expect(core.revision).toBeString();
    expect(core.asVersion).toBeString();
    expect(core.asWarDate).toBeString();
  });

  test("systemContextInfoGet", async () => {
    const { client, sessionId } = ctx;

    const system = await client.systemContextInfoGet(sessionId);
    expect(system.systemDate).toBeString();
    expect(system.systemInfo).toBeString();
    expect(system.systemName).toBeString();
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

  test("systemInfoGet", async () => {
    const { client, sessionId } = ctx;

    const value1 = await client.systemInfoGet(sessionId, "SYS_NAME");
    expect(value1).toBeString();
    const value2 = await client.systemInfoGet(sessionId, "NOVO.MINIMUM_VERSION");
    expect(value2).toBeString();
    const value3 = await client.systemInfoGet(sessionId, "UNKNOWN");
    expect(value3).toBeUndefined();
  });

  test("systemLimitGet", async () => {
    const { client, sessionId } = ctx;

    const value = await client.systemLimitGet(sessionId, "SYS_NAME");
    expect(value).toBeString();
  });

  test("systemContextGet", async () => {
    const { client, sessionId } = ctx;

    const value1 = await client.systemContextGet(sessionId, "IBS_USER", "SYS_VERSION");
    expect(value1).toBeString();
    const value2 = await client.systemContextGet(sessionId, "IBS_USER", "USER_CONTEXT");
    expect(value2).toBeString();
    const value3 = await client.systemContextGet(sessionId, "IBS_USER", "USER_LOCK_OPEN");
    expect(value3).toBeString();
    const value4 = await client.systemContextGet(sessionId, "IBS_USER", "SYS_BUILD_DATE");
    expect(value4).toBeString();
  });

  test("systemApplicationNameGet", async () => {
    const { client, sessionId } = ctx;

    const name = await client.systemApplicationNameGet(sessionId);
    expect(name).toBeString();
  });

  test("contextInformationAvailableCheck", async () => {
    const { client, sessionId } = ctx;

    const is_check = await client.contextInformationAvailableCheck(sessionId);
    expect(is_check).toBeString();
  });

  test("systemHelpSystemInfoGet", async () => {
    const { client, sessionId } = ctx;

    try {
      const count = await client.systemHelpSystemInfoGet(sessionId);
      expect(count).toBeNumber();
    } catch (e) {
      expect((e as ApiError).message).toBe("Справка не установлена");
    }
  });

  test("embeddedInteractionAvailableCheck", async () => {
    const { client, sessionId } = ctx;

    const is_check = await client.embeddedInteractionAvailableCheck(sessionId);
    expect(is_check).toBeString();
  });

  test("embeddedInteractionRequiredCheck", async () => {
    const { client, sessionId } = ctx;

    const is_check = await client.embeddedInteractionRequiredCheck(sessionId);
    expect(is_check).toBeString();
  });

  test("embeddedInteractionGetResource", async () => {
    const { client, sessionId } = ctx;

    const url1 = await client.embeddedInteractionGetResource(sessionId);
    expect(url1).toBeString();
    const url2 = await client.embeddedInteractionGetResource(sessionId, "STATUS");
    expect(url2).toBeString();
  });

  test("embeddedInteractionPost", async () => {
    const { client, sessionId } = ctx;

    await client.embeddedInteractionPost(sessionId, "ExitApplication");
  });

  test("embeddedInteractionGet", async () => {
    const { client, sessionId } = ctx;

    const res = await client.embeddedInteractionGet(sessionId, "VER");
    expect(res).toBeString();
  });
});
