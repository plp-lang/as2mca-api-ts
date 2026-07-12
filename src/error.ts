/**
 * Сетевая ошибка – проблемы с соединением, таймауты, некорректные статусы.
 */
export class HttpError extends Error {
  public readonly code: number;
  public readonly url?: string;

  /**
   * @param message - Сообщение об ошибке.
   * @param code - HTTP-статус.
   * @param url - Адрес запроса (опционально).
   * @param options - Дополнительные параметры ошибки.
   */
  constructor(message: string, code: number, url?: string, options?: ErrorOptions) {
    super(`HTTP request failed, code: ${code}, message ${message}, url ${url}`, options);
    this.name = this.constructor.name;
    this.code = code;
    this.url = url;
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * API‑ошибки – сервер вернул структурированное сообщение об ошибке.
 */
export class ApiError extends Error {
  public readonly details: string;

  /**
   * @param message - Текст ошибки (@Text).
   * @param details - Дополнительная информация (ServerErrorInfo/@Text).
   */
  constructor(message: string, details: string) {
    super(`API request failed, message: ${message}, details: ${details}`);
    this.name = this.constructor.name;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Ошибка, возникающая, когда сервер возвращает неожиданный формат ответа.
 * Обычно это означает, что API изменилось и несовместимо с текущей версией библиотеки.
 */
export class UnexpectedResponseError extends Error {
  public readonly actual: string;

  /**
   * @param actual - Содержимое ответа, которое не удалось распарсить.
   * @param options - Дополнительные параметры ошибки.
   */
  constructor(actual: string, options?: ErrorOptions) {
    super(
      `Unexpected server response. The server API has changed and is incompatible with the current library version. Please open an issue in the project repository and include the details below. Received data: ${actual}`,
      options,
    );
    this.name = this.constructor.name;
    this.actual = actual;
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Ошибка несоответствия XML‑схеме
 */
export class XmlSerializeError extends Error {
  /**
   * @param message - Детали ошибки.
   * @param options - Дополнительные параметры.
   */
  constructor(message: string, options?: ErrorOptions) {
    super(`XML serialization error: ${message}.`, options);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Ошибка несоответствия XML‑схеме или сервер вернул неожиданный формат ответа
 */
export class XmlDeserializeError extends Error {
  /**
   * @param message - Детали ошибки.
   * @param options - Дополнительные параметры.
   */
  constructor(message: string, options?: ErrorOptions) {
    super(
      `XML deserialization error: ${message}. The server API has changed and is incompatible with the current library version. Please open an issue in the project repository and include the details below.`,
      options,
    );
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
