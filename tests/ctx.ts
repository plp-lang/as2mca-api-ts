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

export function context(): Context {
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

export const NEW_FP_TUNE = async (ctx: Context, value: string): Promise<string | undefined> => {
  const classId = "FP_TUNE";
  const shortName = "NEW#AUTO";

  const { client, sessionId } = ctx;

  const methods = await client.classMethodsGet(sessionId, classId);
  const methodId = methods.find((v) => v.shortName === shortName)?.id;
  if (methodId === undefined) {
    return undefined;
  }

  const frameId = await client.methodBegin(sessionId, methodId);
  if (frameId === undefined) {
    return undefined;
  }

  await client.methodValidateDefault(sessionId, {
    classId,
    methodId,
  });

  await client.methodValidate(sessionId, {
    methodId,
    info: "%PARAM%.P_CODE",
    controlsStates: [{ id: "17007818", value }],
  });

  await client.methodValidate(sessionId, {
    methodId,
    info: "%PARAM%.P_NAME",
    controlsStates: [{ id: "17007820", value }],
  });

  await client.methodValidate(sessionId, {
    methodId,
    info: "%PARAM%.P_GROUP_ID",
    controlsStates: [{ id: "17007839", value }],
  });

  await client.methodValidate(sessionId, {
    methodId,
    info: "%VAR%.V_VAL_TYPE.0",
    controlsStates: [{ id: "17007844", value: "4" }],
  });

  await client.methodValidate(sessionId, {
    methodId,
    info: "%VAR%.V_VAL_BOOL.0",
    controlsStates: [{ id: "17007835", value: "1" }],
  });

  const { value: objectId } = await client.methodExecute(sessionId, {
    methodId,
  });

  await client.methodEnd(sessionId, frameId);
  
  return objectId;
};

export const DELETE_FP_TUNE = async (ctx: Context, id: string): Promise<string | undefined> => {
  const classId = "FP_TUNE";
  const shortName = "DELETE#AUTO";

  const { client, sessionId } = ctx;

  const methods = await client.classMethodsGet(sessionId, classId);
  const methodId = methods.find((v) => v.shortName === shortName)?.id;
  if (methodId === undefined) {
    return undefined;
  }

  const frameId = await client.methodBegin(sessionId, methodId);
  if (frameId === undefined) {
    return undefined;
  }

  await client.methodValidateDefault(sessionId, {
    classId,
    methodId,
    objectId: [id],
  });
  
  let { value } = await client.methodExecute(sessionId, {
    methodId,
  });

  await client.methodEnd(sessionId, frameId);

  return value
};

