import fetchCookie from "fetch-cookie";
import { CookieJar } from "tough-cookie";

import type { HttpAdapter, HttpAuthBasicResponse, HttpApiResponse } from "./http-adapter";

/**
 * Реализация HttpAdapter с поддержкой cookies.
 * - В Node.js использует fetch-cookie + tough-cookie для автоматического управления куками.
 * - В браузере использует нативный fetch с credentials: "include".
 *
 * Позволяет внедрить собственный экземпляр fetch (например, для тестов или браузера).
 */
export class FetchHttpAdapter implements HttpAdapter {
  private fetcher: (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

  /**
   * @param options - конфигурация адаптера
   * @param options.fetchImpl - экземпляр fetch для использования (если не передан, создаётся автоматически)
   * @param options.cookieJar - экземпляр CookieJar из tough-cookie (для Node.js)
   *   Если не передан и используется Node.js, создаётся новый CookieJar.
   *   В браузере этот параметр игнорируется.
   */
  constructor(options?: { fetchImpl?: typeof fetch; cookieJar?: CookieJar }) {
    const { fetchImpl, cookieJar } = options || {};
    if (fetchImpl) {
      this.fetcher = fetchImpl;
    } else {
      if (typeof window === "undefined") {
        const jar = cookieJar || new CookieJar();
        this.fetcher = fetchCookie(fetch, jar);
      } else {
        this.fetcher = fetch;
      }
    }
  }

  /**
   * Выполняет GET-запрос на /authbasic.
   * @param url - Полный URL.
   * @param headers - Дополнительные заголовки.
   * @returns Ответ с кодом и текстом статуса.
   */
  async authbasic(url: string, headers?: Record<string, string>): Promise<HttpAuthBasicResponse> {
    const response = await this.fetcher(url, {
      method: "GET",
      headers,
      credentials: "include",
    });
    return {
      status: response.status,
      statusText: response.statusText,
    };
  }

  /**
   * Выполняет POST-запрос на /api с XML-телом.
   * Устанавливает Content-Type: text/xml; charset=utf-8.
   * @param url - Полный URL.
   * @param body - XML-строка запроса.
   * @param headers - Дополнительные заголовки.
   * @returns Ответ с кодом, текстом статуса и телом в виде строки.
   */
  async api(url: string, body: string, headers?: Record<string, string>): Promise<HttpApiResponse> {
    const response = await this.fetcher(url, {
      method: "POST",
      headers,
      body,
      credentials: "include",
    });
    const text = await response.text();
    return {
      status: response.status,
      statusText: response.statusText,
      body: text,
    };
  }
}
