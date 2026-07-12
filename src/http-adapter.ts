/**
 * Результат выполнения HTTP-запроса авторизации (authbasic).
 */
export interface HttpAuthBasicResponse {
  /** HTTP-код статуса. */
  status: number;
  /** Текстовое описание статуса. */
  statusText: string;
}

/**
 * Результат выполнения API-запроса (POST /api).
 */
export interface HttpApiResponse {
  /** HTTP-код статуса. */
  status: number;
  /** Текстовое описание статуса. */
  statusText: string;
  /** Тело ответа (XML в виде строки). */
  body: string;
}

/**
 * Адаптер для выполнения HTTP-запросов к серверу приложений.
 */
export interface HttpAdapter {
  /**
   * Выполняет GET-запрос на /authbasic для Basic-авторизации.
   * @param url - Полный URL эндпоинта.
   * @param headers - Дополнительные заголовки.
   * @returns Ответ с кодом и текстом статуса.
   */
  authbasic(url: string, headers?: Record<string, string>): Promise<HttpAuthBasicResponse>;

  /**
   * Выполняет POST-запрос на /api с XML-телом.
   * @param url - Полный URL эндпоинта.
   * @param body - XML-строка запроса.
   * @param headers - Дополнительные заголовки.
   * @returns Ответ с кодом, текстом статуса и телом в виде строки.
   */
  api(url: string, body: string, headers?: Record<string, string>): Promise<HttpApiResponse>;
}
