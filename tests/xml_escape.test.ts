import { describe, expect, test } from "bun:test";
import { context, DELETE_FP_TUNE, NEW_FP_TUNE } from "./ctx";

const TEST_OBJECT_VALUES = [{ sign: "&" }, { sign: "'" }, { sign: "<" }, { sign: ">" }, { sign: "4" }];

describe.each(TEST_OBJECT_VALUES)("Экранирование символа: `$sign`", ({ sign }) => {
  const ctx = context();

  test("Создания тестового экземпляра в FP_TUNE", async () => {
    const id = await NEW_FP_TUNE(ctx, `TEST_${sign}_DATA`) as string;
    expect(id).toBeString();
    const value = await DELETE_FP_TUNE(ctx, id);
    expect(value).toBeString();
  });
});
