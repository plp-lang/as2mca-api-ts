import { describe, expect, test } from "bun:test";
import { context } from "./ctx";

describe("Сессия и информация о пользователе", () => {
  const ctx = context();

  test("sessionInit", () => {
    const { debugPipeName, sessionId } = ctx;

    expect(sessionId).toBeDefined();
    expect(sessionId).toMatch(/^([0-9a-fA-F]{32}|[\w-]+!\d+!\d+)$/);

    expect(debugPipeName).toBeDefined();
    expect(debugPipeName).toMatch(/^debug\$\d{10}$/);
  });

  test("systemUserPrivilegedGet", async () => {
    const { client, sessionId } = ctx;

    const isPrivileged = await client.systemUserPrivilegedGet(sessionId);
    expect(isPrivileged).toBeTrue();
  });

  test("userInfoGet", async () => {
    const { client, sessionId } = ctx;

    const userInfo = await client.userInfoGet(sessionId);
    expect(userInfo.name).toBeString();
    expect(userInfo.shortName).toBeString();
    expect(userInfo.properties).toBeString();
  });

  test("userProfilePropertyGet", async () => {
    const { client, sessionId } = ctx;

    const value = await client.userProfilePropertyGet(sessionId, "SESSIONS_PER_USER");
    expect(value).toBe("UNLIMITED");
  });

  test("userBelongsGroupCheck", async () => {
    const { client, sessionId } = ctx;

    const isCheck = await client.userBelongsGroupCheck(sessionId, "ADMIN_GRP");
    expect(isCheck).toBeTrue();
  });

  test("networkInformationSet", async () => {
    const { client, sessionId } = ctx;

    await client.networkInformationSet(sessionId, {
      clientUser: "john",
      clientName: "my-host",
      moduleName: "MyApp/1.0",
      clientIP: "192.168.1.100",
    });
  });

  test("systemNetAddressSet", async () => {
    const { client, sessionId } = ctx;

    await client.systemNetAddressSet(sessionId, {
      IPAddress: "192.168.1.100",
      MACAddress: "aabbccddeeff",
    });
  });
});
