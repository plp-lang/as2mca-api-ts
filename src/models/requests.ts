//======================================================================================================================
// Сессия и информация о пользователе
//======================================================================================================================

/**
 * Установка информации о сетевом окружении клиента.
 */
export interface NetworkInformationSet {
  /** Hostname устройства пользователя. */
  clientName: string;
  /** Локальный IP‑адрес. */
  clientIP: string;
  /** Имя пользователя ОС (например, из `whoami`). */
  clientUser: string;
  /** Название клиентского приложения (например, "ЦФТ - Навигатор 6.0"). */
  moduleName: string;
}

/**
 * Установка MAC и IP адресов клиента.
 */
export interface SystemNetAddressSet {
  /** MAC‑адрес устройства (например, "aabbccddeeff"). */
  MACAddress: string;
  /** Локальный IP‑адрес. */
  IPAddress: string;
}

//======================================================================================================================
// Представления и данные
//======================================================================================================================

/**
 * Запрос данных представления с возможностью отмены.
 */
export interface ViewDataGetCancelable {
  /** Короткое имя представления. */
  viewShortName: string;
  /** Короткое имя ТБП. */
  classId: string;
  /** Подсказка для оптимизатора (например, "FIRST_ROWS"). */
  hint?: string;
  /** Разрешить миллисекунды в метках времени. */
  allowTimestampMilliseconds?: boolean;
  /** Лимит строк (опционально). */
  rowsLimit?: number;
  /** Дополнительный фильтр (опционально). */
  additionalFilterBindClause?: string;
  /** Фильтр по объекту (опционально). */
  objectIdFilter?: string;
  /** Дополнительный фильтр SQL (опционально). */
  extraFilter?: string;
  /** Дополнительные фильтры по колонкам (опционально). */
  userFilter?: UserFilter;
}

export type UserFilter = {
  and?: Filter[];
  or?: Filter[];
};

/**
 * Объединённый тип фильтра для представления.
 */
export type Filter =
  | { and: Filter[] }
  | { or: Filter[] }
  | { simpleFilter: SimpleFilter }
  | { caseInsensitiveFilter: CaseInsensitiveFilter };

/**
 * Простой фильтр для представления.
 */
export interface SimpleFilter {
  /** Имя колонки. */
  columnName: string;
  /** Оператор сравнения (например, "=", "LIKE"). */
  operator: string;
  /** Значение для сравнения (опционально). */
  value?: string;
}

/**
 * Регистронезависимый фильтр для представления.
 */
export interface CaseInsensitiveFilter {
  /** Имя колонки. */
  columnName: string;
  /** Оператор сравнения. */
  operator: string;
  /** Значение для сравнения (опционально). */
  value?: string;
}
