//======================================================================================================================
// Сессия и информация о пользователе
//======================================================================================================================

/**
 * Ответ с данными успешно инициализированной сессии.
 * @category model
 */
export interface SessionInfo {
  /** Идентификатор сессии. */
  sessionId: string;
  /** Имя отладочного канала. */
  debugPipeName: string;
}

/**
 * Базовая информация о пользователе.
 * @category model
 */
export interface UserInfo {
  /** Полное имя (ФИО). */
  name: string;
  /** Короткое имя в системе. */
  shortName: string;
  /** Строка параметров, разделённых `|`. */
  properties: string;
}

//======================================================================================================================
// Информация о системе
//======================================================================================================================

/**
 * Информация о ядре системы.
 * @category model
 */
export interface CoreInfo {
  /** Код аудитора (например, "AUD"). */
  auditor: string;
  /** Владелец (например, "IBS"). */
  owner: string;
  /** Версия ТЯ (например, "7.6"). */
  version: string;
  /** Номер сборки. */
  build: string;
  /** Ревизия. */
  revision: string;
  /** Версия сервера приложений. */
  asVersion: string;
  /** Дата сборки сервера приложений. */
  asWarDate: string;
}

/**
 * Cистемная настройка (ключ-значение).
 * @category model
 */
export interface Setting {
  /** Имя настройки. */
  name: string;
  /** Значение настройки (может отсутствовать). */
  value?: string;
}

//======================================================================================================================
// ТБП и их экземпляры
//======================================================================================================================

/**
 * Идентификатор ТБП и ключ архива экземпляра.
 * @category model
 */
export interface ObjectClassAndArchiveKey {
  /** Короткое имя текущего ТБП экземпляра. */
  classId?: string;
  /** Ключ архива. */
  archiveKey?: string;
}

/**
 * Обратная ссылка на экземпляр.
 * @category model
 */
export interface BackwardReference {
  /** Короткое имя ТБП, который ссылается. */
  classId: string;
  /** Полное имя ТБП. */
  className: string;
  /** Квалификатор. */
  qual: string;
  /** Имя квалификатора. */
  qualName: string;
}

/**
 * Переход состояний ТБП.
 * @category model
 */
export interface Transition {
  /** Идентификатор перехода. */
  id: string;
  /** Название перехода. */
  name: string;
  /** Короткое имя операции (может отсутствовать). */
  methodShortName?: string;
  /** ID начального состояния. */
  initialStateID: string;
  /** ID конечного состояния. */
  finalStateID: string;
}

/**
 * Состояние ТБП.
 * @category model
 */
export interface State {
  /** Идентификатор состояния. */
  id: string;
  /** Название состояния. */
  name: string;
  /** Индекс использования. */
  indexUse: string;
}

/**
 * Дочерний ТБП.
 * @category model
 */
export interface ChildClass {
  /** Короткое имя дочернего ТБП. */
  id: string;
}

/**
 * Описание ТБП (класса).
 * @category model
 */
export interface Class {
  /** Короткое имя ТБП. */
  id: string;
  /** Полное имя. */
  name: string;
  /** Базовый ТБП. */
  baseClassId: BaseClassID;
  /** Идентификатор сущности. */
  entityId: string;
  /** Является типом ядра. */
  isKernelType: boolean;
  /** Интерфейс класса. */
  classInterface: string;
  /** Флаги (строка из 25 символов). */
  flags: string;
  /** Заголовок в меню (опционально). */
  menuCaption?: string;
  /** Доступность (опционально). */
  isAccessible?: boolean;
  /** Длина отступа (опционально). */
  padLength?: string;
  /** Размер данных (опционально). */
  dataSize?: string;
  /** Точность данных (опционально). */
  dataPrecision?: string;
  /** Свойства (опционально). */
  properties?: string;
  /** Идентификатор группы (опционально). */
  groupId?: string;
}

/**
 * @category model
 */
export type BaseClassID = "STRUCTURE";

/**
 * Группа справочников.
 * @category model
 */
export interface GuidesGroup {
  /** Идентификатор группы. */
  id: string;
  /** Название группы. */
  name: string;
}

//======================================================================================================================
// Операции
//======================================================================================================================

/**
 * Описание операции.
 * @category model
 */
export interface Method {
  /** Идентификатор операции. */
  id: string;
  /** Полное наименование. */
  name: string;
  /** Короткое имя. */
  shortName: string;
  /** Тип операции. */
  type: MethodType;
  /** Идентификатор класса формы. */
  formClassId: string;
  /** Свойства. */
  properties: string;
  distance: string;
  /** Короткое имя вызываемого объекта. */
  callableShortName: string;
  /** Идентификатор клиент-скрипта (опционально). */
  scriptId?: string;
  /** Короткое имя возвращаемого типа (опционально). */
  resultClassId?: string;
  /** Вызывается пользователем (опционально). */
  userDriven?: boolean;
  /** Идентификатор формы (опционально). */
  formId?: string;
  /** Тип отчёта (опционально). */
  reportType?: string;
  /** Шаблон отчёта (опционально). */
  reportTemplate?: string;
}

/**
 * Тип операции.
 *
 * `C` — конструктор.
 * `G` — списочная операция.
 * `M` — простая операция.
 * `R` — отчёт.
 * `S` — групповая операция.
 * `Y` — деструктор.
 * `O` — выбор.
 * `P` — печать.
 *
 * @category model
 */
export type MethodType = "C" | "G" | "M" | "R" | "S" | "Y" | "O" | "P";

/**
 * Описание входного параметра операции.
 * @category model
 */
export interface MethodParameter {
  /** Короткое имя параметра. */
  shortName: string;
  /** ТБП параметра. */
  classId: string;
  /** Позиция. */
  position: string;
  /** Тип ссылки. */
  referenceType: ReferenceType;
  /** Направление. */
  direction: Direction;
  /** Идентификатор представления (опционально). */
  viewId?: string;
  /** Класс представления (опционально). */
  viewClassId?: string;
  /** Фильтр представления (опционально). */
  viewFilter?: string;
  /** Значение по умолчанию (опционально). */
  defaultValue?: string;
}

/**
 * Тип ссылки.
 *
 * `D` — `default`.
 * `T` — `table of`.
 * `R` — `ref`.
 *
 * @category model
 */
export type ReferenceType = "D" | "T" | "R";

/**
 * Направление параметра.
 *
 * `I` — `in`.
 * `D` — `default`
 * `B` — `in out`
 * `O` — `out`
 *
 * @category model
 */
export type Direction = "D" | "I" | "B" | "O";

/**
 * Описание публичной переменной операции.
 * @category model
 */
export interface MethodVariable {
  /** Имя переменной. */
  shortName: string;
  /** ТБП переменной. */
  classId: string;
  /** Позиция. */
  position: string;
  /** Тип ссылки. */
  referenceType: ReferenceType;
}

/**
 * Результат выполнения блока `Validate`.
 * @category model
 */
export interface Validate {
  /** Отладочный текст. */
  debugText: string;
  /** Состояния элементов. */
  controlsStates: ControlState[];
}

/**
 * Состояние элемента на форме.
 * @category model
 */
export interface ControlState {
  /** Идентификатор элемента. */
  id: string;
  /** Значение элемента. */
  value: string;
}

/**
 * Результат выполнения блока `Execute`.
 * @category model
 */
export interface MethodResult {
  /** Результат операции (число, может отсутствовать). */
  value?: string;
  /** Состояния элементов. */
  controlsStates: ControlState[];
}

/**
 * Описание элемента формы.
 * @category model
 */
export interface Control {
  /** Идентификатор элемента. */
  id: string;
  /** Идентификатор операции. */
  methodId: string;
  /** Квалификатор. */
  qualifier: string;
  /** Тип элемента. */
  control: ControlType;
  /** Заголовок. */
  caption: string;
  /** Отступ сверху (пиксели). */
  top: string;
  /** Отступ слева (пиксели). */
  left: string;
  /** Высота (пиксели). */
  height: string;
  /** Ширина (пиксели). */
  width: string;
  /** Индекс табуляции. */
  tabIndex: string;
  /** Позиция. */
  position: string;
  /** Имя для валидации. */
  validateName: string;
  /** Идентификатор родительского элемента (может отсутствовать). */
  parentId?: string;
  /** ТБП значения (опционально). */
  classId?: string;
  /** Зависимость (опционально). */
  depend?: string;
  /** Свойства (опционально). */
  properties?: string;
  /** Подсказка (опционально). */
  tips?: string;
}

/**
 * Тип элемента формы.
 * @category model
 */
export type ControlType =
  | "FORM"
  | "LABEL"
  | "TEXT"
  | "OBJECT"
  | "CHECK"
  | "BUTTON"
  | "SUBFORM"
  | "LINE"
  | "MEMO"
  | "FRAME"
  | "DATE"
  | "VARIANT"
  | "ARRAY"
  | "PANEL"
  | "COMBO"
  | "NUMBER"
  | "DEPEND"
  | "TABBED"
  | "GRID"
  | "GRIDCOL"
  | "TABLE";

//======================================================================================================================
// Представления и данные
//======================================================================================================================

/**
 * Описание представления.
 * @category model
 */
export interface View {
  /** Идентификатор. */
  id: string;
  /** Название. */
  name: string;
  /** Короткое имя. */
  shortName: string;
  /** По умолчанию? (0/1) */
  isDefault: boolean;
  /** Свойства. */
  properties: string;
  /** Расстояние. */
  distance: string;
  /** Права объекта. */
  objectRights: string;
  /** Печать. */
  toPrinter: boolean;
  /** В файл. */
  toFile: boolean;
  /** Сортировка (опционально). */
  orderBy?: string;
  /** Подсказки (опционально). */
  hints?: string;
  /** Скрипт стиля ячеек (опционально). */
  cellStyleScript?: string;
  /** Идентификатор источника (опционально). */
  sourceId?: string;
  /** Идентификатор расширения (опционально). */
  extensionId?: string;
  /** Короткое имя метода фильтра (опционально). */
  filterMethodShortName?: string;
  /** Свойства метода фильтра (опционально). */
  filterMethodProperties?: string;
}

/**
 * Описание колонки представления.
 * @category model
 */
export interface Column {
  /** Имя колонки. */
  name: string;
  /** Ширина. */
  width: string;
  /** Выравнивание. */
  align: Align;
  /** Позиция. */
  position: string;
  /** Квалификатор. */
  qual: string;
  /** Псевдоним. */
  alias: string;
  /** Базовый тип. */
  base: ColumnBase;
  /** Изменяемый размер. */
  isSizeable: boolean;
  /** Видимость. */
  isInvisible: Invisible;
  /** Возможность выполнения операции. */
  abilityPerformOperation: boolean;
  /** Стиль ячейки. */
  isCellStyle?: boolean;
  /** Редактируемость (опционально). */
  isEditable?: boolean;
  /** Идентификатор ссылки (опционально). */
  referenceId?: string;
  /** Целевой ТБП (опционально). */
  targetClassId?: string;
  /** Тип ссылки (опционально). */
  referenceType?: string;
  /** Логирование (опционально). */
  logging?: Logging;
}

/**
 * Базовый тип данных колонки.
 * @category model
 */
export type ColumnBase =
  | "MEMO"
  | "DATE"
  | "STRING"
  | "NUMBER"
  | "BOOLEAN"
  | "REFERENCE"
  | "COLLECTION"
  | "OLE"
  | "NULL"
  | "STATE";

/**
 * Выравнивание.
 *
 * - 0-лево
 * - 1-центр
 * - 2-право
 *
 * @category model
 */
export type Align = "0" | "1" | "2";

/**
 * Видимость.
 *
 * - 0-видимо
 * - 2-скрыто
 *
 * @category model
 */
export type Invisible = "0" | "2";

/**
 * Логирование.
 * @category model
 */
export type Logging = "0" | "D";

/**
 * Значение колонки в строке.
 * @category model
 */
export interface RowItem {
  /** Имя колонки. */
  columnName: string;
  /** Значение. */
  value: string;
}
