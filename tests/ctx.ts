import { beforeEach, afterEach } from "bun:test";

import { Client } from "../src";

export interface Context {
  client: Client;
  sessionId: string;
  debugPipeName: string;
}

export function context() {
  let ctx: Context = {} as Context;

  beforeEach(async () => {
    const url = Bun.env["AS2MCA_API_URL"] ?? "http://localhost:3000/platform2mca/";
    const username = Bun.env["AS2MCA_API_USERNAME"] ?? "test";
    const password = Bun.env["AS2MCA_API_PASSWORD"] ?? "test";

    const client = new Client(url);
    await client.authbasic(username, password);
    const { sessionId, debugPipeName } = await client.sessionInit();

    ctx.client = client;
    ctx.sessionId = sessionId;
    ctx.debugPipeName = debugPipeName;
  });

  afterEach(async () => {
    await ctx.client.sessionDeinit(ctx.sessionId);
  });

  return ctx;
}
