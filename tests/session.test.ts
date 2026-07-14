import { describe, expect, test } from "bun:test";
import { context } from "./ctx";

describe("Session", () => {
  const ctx = context();

  test("`session_id` and `debug_pipe_name`", () => {
    const { debug_pipe_name, session_id } = ctx;
    
    expect(session_id).toBeDefined();
    expect(session_id).toMatch(/^([0-9a-fA-F]{32}|[\w-]+!\d+!\d+)$/);
    
    expect(debug_pipe_name).toBeDefined();
    expect(debug_pipe_name).toMatch(/^debug\$\d{10}$/);
  })
});
