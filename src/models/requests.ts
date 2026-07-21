import type { ControlState } from "./responses";

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
// Операции
//======================================================================================================================

/**
 * Запрос вызова блока `Validate` операции (по умолчанию, при открытии формы).
 */
export interface MethodValidateDefault {
  /** Идентификатор операции. */
  methodId: string;
  /** Значение переменной P_INFO. */
  info?: string;
  /** Флаг подтверждения транзакции. */
  doCommit?: boolean;
  /** Строка с идентификаторами объектов через запятую (например, "1,2,3"). */
  objectId?: string[];
  /** Короткое имя ТБП. */
  classId: string;
  /** Уровень отладки. */
  debugLevel?: number;
  /** Вызывается ли операция из другой операции. */
  isCalledFromAnotherMethod?: boolean;
  /** Флаг только для чтения. */
  readOnly?: boolean;
  /** Идентификатор ТБП для блокировки (опционально). */
  lockObjectClassId?: string;
  /** Получать ли отладочный текст. */
  getDebugText?: boolean;
  /** Оптимизированные обновления грида. */
  optimizedGridUpdates?: boolean;
}

/**
 * Запрос на вызов блока `Validate` операции при событии элемента формы.
 */
export interface MethodValidate {
  /** Идентификатор операции. */
  methodId: string;
  /** Тип валидации. */
  type?: ValidateType;
  /** Значение переменной P_INFO. */
  info: string;
  /** Флаг подтверждения транзакции. */
  doCommit?: boolean;
  /** Получать ли отладочный текст. */
  getDebugText?: boolean;
  /** Оптимизированные обновления грида. */
  optimizedGridUpdates?: boolean;
  /** Состояния элементов управления (может быть один или несколько). */
  controlsStates?: ControlState[];
  /** Параметры PLP-вызовов (может быть один или несколько). */
  plpCallParameters?: PLPCallParameter[];
}

export type ValidateType = "VALIDATE";

/**
 * Константа для PLP-вызова.
 */
export interface PLPConstant {
  /** Значение константы. */
  value: string;
}

/**
 * Переменная для PLP-вызова.
 */
export interface PLPVariable {
  /** Идентификатор операции. */
  methodId: string;
  /** Имя переменной. */
  name: string;
}

/**
 * Параметр для PLP-вызова.
 */
export interface PLPParameter {
  /** Идентификатор операции. */
  methodId: string;
  /** Имя переменной. */
  name: string;
}

/**
 * Объединённый тип сущности для PLP вызова.
 */
export type PLPEntity = { constant: PLPConstant } | { variable: PLPVariable } | { parameter: PLPParameter };

/**
 * Параметр PLP-вызова (источник и цель).
 */
export interface PLPCallParameter {
  /** Исходная сущность PLP. */
  source: PLPEntity[];
  /** Целевая сущность PLP. */
  target: PLPEntity[];
}

/**
 * Запрос на вызов блока `Execute` операции.
 */
export interface MethodExecute {
  /** Идентификатор операции. */
  methodId: string;
  /** Флаг подтверждения транзакции. */
  doCommit?: boolean;
  /** Оптимизированные обновления грида. */
  optimizedGridUpdates?: boolean;
  /** Состояния элементов управления (может быть один или несколько). */
  controlsStates?: ControlState[];
  /** Параметры PLP-вызовов (может быть один или несколько). */
  plpCallParameters?: PLPCallParameter[];
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

//======================================================================================================================
// Блокировки
//======================================================================================================================

/**
 * Описание экземпляра для блокировки.
 */
export interface Object {
  /** Идентификатор экземпляра. */
  id: string;
  /** Короткое имя ТБП. */
  classId: string;
}
