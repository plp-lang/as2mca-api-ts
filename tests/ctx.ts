import { beforeAll, afterAll } from "bun:test";

import { getLogger, configure, getConsoleSink } from "@logtape/logtape";
import { prettyFormatter } from "@logtape/pretty";

import { Client, FetchHttpAdapter, type HttpAdapter, type HttpApiResponse, type HttpAuthBasicResponse } from "../src";

export interface Context {
  client: Client;
  sessionId: string;
  debugPipeName: string;
}

await configure({
  sinks: {
    console: getConsoleSink({ formatter: prettyFormatter }),
  },
  loggers: [
    { category: ["logtape", "meta"], sinks: ["console"], lowestLevel: "warning" },
    { category: "as2mca-api", sinks: ["console"], lowestLevel: (Bun.env["AS2MCA_API_LOG_LEVEL"] as any) ?? "info" },
  ],
});

export class TestHttpAdapter implements HttpAdapter {
  private readonly httpAdapter: HttpAdapter = new FetchHttpAdapter();
  private readonly log = getLogger(["as2mca-api"]);

  async authbasic(url: string, headers?: Record<string, string>): Promise<HttpAuthBasicResponse> {
    this.log.trace("-> started processing request, url: {url}", { url });
    const res = await this.httpAdapter.authbasic(url, headers);
    this.log.trace("<- finished processing request, url: {url}, status: {status}, response: {statusText}", {
      url,
      ...res,
    });
    return res;
  }

  async api(url: string, body: string, headers?: Record<string, string>): Promise<HttpApiResponse> {
    this.log.trace("-> started processing request, url: {url}, request: {body}", { url, body });
    const res = await this.httpAdapter.api(url, body, headers);
    this.log.trace(
      "<- finished processing request, url: {url}, status: {status}, request: {req_body}, response: {body}",
      { url, req_body: body, ...res },
    );
    return res;
  }
}

export function context() {
  let ctx: Context = {} as Context;

  beforeAll(async () => {
    const url = Bun.env["AS2MCA_API_URL"] ?? "http://localhost:3000/platform2mca/";
    const username = Bun.env["AS2MCA_API_USERNAME"] ?? "test";
    const password = Bun.env["AS2MCA_API_PASSWORD"] ?? "test";

    const client = new Client(url, new TestHttpAdapter());
    await client.authbasic(username, password);
    const { sessionId, debugPipeName } = await client.sessionInit();

    ctx.client = client;
    ctx.sessionId = sessionId;
    ctx.debugPipeName = debugPipeName;
  });

  afterAll(async () => {
    await ctx.client.sessionDeinit(ctx.sessionId);
  });

  return ctx;
}
