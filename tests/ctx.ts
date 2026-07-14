import { beforeEach, afterEach } from "bun:test";

import { Client } from "../src";

export interface Context {
  client: Client;
  session_id: string;
  debug_pipe_name: string;
}

export function context() {
  let ctx: Context = {} as Context;

  beforeEach(async () => {
    const url = Bun.env["AS2MCA_API_URL"] ?? "http://localhost:3000/platform2mca/";
    const username = Bun.env["AS2MCA_API_USERNAME"] ?? "test";
    const password = Bun.env["AS2MCA_API_PASSWORD"] ?? "test";

    const client = new Client(url);
    await client.authbasic(username, password);
    const { session_id, debug_pipe_name } = await client.session_init();

    ctx.client = client;
    ctx.session_id = session_id;
    ctx.debug_pipe_name = debug_pipe_name;
  });

  afterEach(async () => {
    await ctx.client.session_deinit(ctx.session_id);
  });

  return ctx;
}
