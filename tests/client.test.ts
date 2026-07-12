import { expect, test } from "bun:test";
import { Client } from "../src";

test("test", async () => {
  const client = new Client("http://localhost:3000/platform2mca/");

  await client.authbasic("test", "test");
  const { session_id, debug_pipe_name } = await client.session_init();

  expect(session_id).toBeDefined();
  expect(session_id).toMatch(/^[0-9a-fA-F]{32}$/);

  expect(debug_pipe_name).toBeDefined();
  expect(debug_pipe_name).toMatch(/^debug\$\d{10}$/);

  await client.session_deinit(session_id);
});
