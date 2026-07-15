/**
 * Базовая обертка XML-ответа от сервера.
 */
export interface Response {
  "?xml": {
    "@version": "1.0";
    "@encoding": "UTF-8";
    "@standalone": "yes";
  };
  Response: ResponseBody;
}

/**
 * Объединённый тип для тела ответа.
 */
export type ResponseBody =
  | { Error: Error }
  | { Done: Done }
  | { Session: Session }
  | { ProtocolInfo: ProtocolInfo }
  | { ServerInfo: ServerInfo }
  | { CoreInfo: CoreInfo }
  | { Settings: Settings }
  | { Setting: Setting }
  | { NovoAllowedCheckResult: NovoAllowedCheckResult }
  | { OptionInfo: OptionInfo }
  | { User: UserInfo }
  | { User: UserPrivileged }
  | { UserProfileProperty: UserProfileProperty }
  | { CheckResult: CheckResult }
  | { AuthenticationURL: AuthenticationURL }
  | { ClientScript: ClientScript }
  | { Result: MethodResult }
  | { Validate: Validate }
  | { MethodFrame: MethodFrame }
  | { MethodParameters: MethodParameters }
  | { MethodVariables: MethodVariables }
  | { Controls: Controls }
  | { Methods: Methods }
  | { MethodsGroups: MethodsGroups }
  | { Class: Class }
  | { NotFound: NotFound }
  | { Classes: Classes }
  | { ChildClasses: ChildClasses }
  | { Transitions: Transitions }
  | { States: States }
  | { BackwardReferences: BackwardReferences }
  | { ObjectClassAndArchiveKey: ObjectClassAndArchiveKey }
  | { LockResult: LockResult }
  | { ViewData: ViewData }
  | { Columns: Columns }
  | { Views: Views }
  | { UserMenu: UserMenu }
  | { Guides: Guides }
  | { GuidesGroups: GuidesGroups }
  | { Types: Types }
  | { PipeText: PipeText }
  | { DebugText: DebugText };

export type KeysOfUnion<T> = T extends any ? keyof T : never;

export type ResponseKey = KeysOfUnion<ResponseBody>;

/**
 * Вспомогательный тип: извлекает тип значения из ResponseBody по ключу K
 */
export type ResponseValue<K extends ResponseKey> = K extends any ? Extract<ResponseBody, Record<K, any>>[K] : never;

/**
 * Ответ "Not Found" (пустой).
 */
export type NotFound = "";

/**
 * Пустой ответ, подтверждающий успешное выполнение действия (например, отключение сессии).
 */
export type Done = "";

/**
 * Структура ошибки API.
 */
export interface Error {
  /** Текст ошибки. */
  "@Text": string;
  /** Детали. */
  ServerErrorInfo: ServerErrorInfo;
}

/**
 * Детали серверной ошибки.
 */
export interface ServerErrorInfo {
  /** Текст ошибки. */
  "@Text": string;
}

//======================================================================================================================
// Сессия и авторизация
//======================================================================================================================

/**
 * Ответ с данными успешно инициализированной сессии.
 */
export interface Session {
  /** Идентификатор сессии. */
  "@ID": string;
  /** Имя отладочного канала. */
  "@DebugPipeName": string;
}

/**
 * Ответ с URL для авторизации.
 */
export interface AuthenticationURL {
  /** Относительный URL для авторизации. */
  "@URL": string;
}

/**
 * Базовая информация о пользователе.
 */
export interface UserInfo {
  /** Полное имя (ФИО). */
  "@Name": string;
  /** Короткое имя в системе. */
  "@ShortName": string;
  /** Строка параметров, разделённых `|`. */
  "@Properties": string;
}

/**
 * Информация о привилегиях пользователя.
 */
export interface UserPrivileged {
  /** true, если пользователь привилегированный. */
  "@IsPrivileged": string;
}

/**
 * Значение свойства профиля пользователя.
 */
export interface UserProfileProperty {
  /** Значение свойства. */
  "@Value": string;
}

/**
 * Универсальный результат проверки (например, вхождения в группу).
 */
export interface CheckResult {
  /** true, если условие выполнено. */
  "@Value": string;
}

//======================================================================================================================
// Информация о системе
//======================================================================================================================

/**
 * Информация о версии протокола.
 */
export interface ProtocolInfo {
  /** Версия протокола (например, "9.54"). */
  "@Version": string;
}

/**
 * Информация о версии сервера.
 */
export interface ServerInfo {
  /** Версия базы данных (например, "12.2.0.1"). */
  "@Version": string;
}

/**
 * Информация о ядре системы.
 */
export interface CoreInfo {
  /** Код аудитора (например, "AUD"). */
  "@Auditor": string;
  /** Владелец (например, "IBS"). */
  "@Owner": string;
  /** Версия ТЯ (например, "7.6"). */
  "@Version": string;
  /** Номер сборки. */
  "@Build": string;
  /** Ревизия. */
  "@Revision": string;
  /** Версия сервера приложений. */
  "@ASVersion": string;
  /** Дата сборки сервера приложений. */
  "@ASWARDate": string;
}

/**
 * Список системных настроек.
 */
export interface Settings {
  /** Массив настроек (может быть пустым). */
  Setting?: Setting | Setting[];
}

/**
 * Cистемная настройка (ключ-значение).
 */
export interface Setting {
  /** Имя настройки. */
  "@Name": string;
  /** Значение настройки (может отсутствовать). */
  "@Value"?: string;
}

/**
 * Результат проверки доступности NOVO.
 */
export interface NovoAllowedCheckResult {
  /** Строка "true"/"false" или "1"/"0" */
  "@Value": string;
}

/**
 * Информация о включенности системной опции.
 */
export interface OptionInfo {
  /** true, если опция включена. */
  "@Enabled": string;
}

//======================================================================================================================
// Отладка
//======================================================================================================================

/**
 * Текст из отладочного канала.
 */
export interface PipeText {
  /** Текст из канала. */
  "@Value": string;
}

/**
 * Отладочный текст.
 */
export interface DebugText {
  /** Отладочная информация (может быть пустой). */
  "@Value": string;
}

//======================================================================================================================
// ТБП и их экземпляры
//======================================================================================================================

/**
 * Идентификатор ТБП и ключ архива экземпляра.
 */
export interface ObjectClassAndArchiveKey {
  /** Короткое имя текущего ТБП экземпляра. */
  "@ClassID"?: string;
  /** Ключ архива. */
  "@ArchiveKey"?: string;
}

/**
 * Обратная ссылка на экземпляр.
 */
export interface BackwardReference {
  /** Короткое имя ТБП, который ссылается. */
  "@ClassID": string;
  /** Полное имя ТБП. */
  "@ClassName": string;
  /** Квалификатор. */
  "@Qual": string;
  /** Имя квалификатора. */
  "@QualName": string;
}

/**
 * Список обратных ссылок.
 */
export interface BackwardReferences {
  /** Массив обратных ссылок (может быть пустым). */
  BackwardReference?: BackwardReference | BackwardReference[];
}

/**
 * Переход состояний ТБП.
 */
export interface Transition {
  /** Идентификатор перехода. */
  "@ID": string;
  /** Название перехода. */
  "@Name": string;
  /** Короткое имя операции (может отсутствовать). */
  "@MethodShortName"?: string;
  /** ID начального состояния. */
  "@InitialStateID": string;
  /** ID конечного состояния. */
  "@FinalStateID": string;
}

/**
 * Список переходов.
 */
export interface Transitions {
  /** Массив переходов (может быть пустым). */
  Transition?: Transition | Transition[];
}

/**
 * Состояние ТБП.
 */
export interface State {
  /** Идентификатор состояния. */
  "@ID": string;
  /** Название состояния. */
  "@Name": string;
  /** Индекс использования. */
  "@IndexUse": string;
}

/**
 * Список состояний.
 */
export interface States {
  /** Массив состояний (может быть пустым). */
  State?: State | State[];
}

/**
 * Дочерний ТБП.
 */
export interface ChildClass {
  /** Короткое имя дочернего ТБП. */
  "@ID": string;
}

/**
 * Список дочерних ТБП.
 */
export interface ChildClasses {
  /** Массив дочерних классов (может быть пустым). */
  ChildClass?: ChildClass | ChildClass[];
}

//======================================================================================================================
// Операции
//======================================================================================================================

/**
 * Описание операции.
 */
export interface Method {
  /** Идентификатор операции. */
  "@ID": string;
  /** Полное наименование. */
  "@Name": string;
  /** Короткое имя. */
  "@ShortName": string;
  /** Тип операции (C, G, M, R, S, Y). */
  "@Type": MethodType;
  /** Идентификатор класса формы. */
  "@FormClassID": string;
  /** Свойства. */
  "@Properties": string;
  "@Distance": string;
  /** Короткое имя вызываемого объекта. */
  "@CallableShortName": string;
  /** Идентификатор клиент-скрипта (опционально). */
  "@ScriptID"?: string;
  /** Короткое имя возвращаемого типа (опционально). */
  "@ResultClassID"?: string;
  /** Вызывается пользователем (опционально). */
  "@UserDriven"?: string;
  /** Идентификатор формы (опционально). */
  "@FormID"?: string;
  /** Тип отчёта (опционально). */
  "@ReportType"?: string;
  /** Шаблон отчёта (опционально). */
  "@ReportTemplate"?: string;
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
 */
export type MethodType = "C" | "G" | "M" | "R" | "S" | "Y" | "O";

/**
 * Список операций.
 */
export interface Methods {
  /** Массив операций (может быть пустым). */
  Method?: Method | Method[];
}

/**
 * Описание входного параметра операции.
 */
export interface MethodParameter {
  /** Короткое имя параметра. */
  "@ShortName": string;
  /** ТБП параметра. */
  "@ClassID": string;
  /** Позиция. */
  "@Position": number;
  /** Тип ссылки. */
  "@ReferenceType": ReferenceType;
  /** Направление. */
  "@Direction": Direction;
  /** Идентификатор представления (опционально). */
  "@ViewID"?: number;
  /** Класс представления (опционально). */
  "@ViewClassID"?: string;
  /** Фильтр представления (опционально). */
  "@ViewFilter"?: string;
  /** Значение по умолчанию (опционально). */
  "@DefaultValue"?: string;
}

/**
 * Тип ссылки.
 */
export type ReferenceType = "D" | "T";

/**
 * Направление параметра.
 */
export type Direction = "D" | "I";

/**
 * Список входных параметров.
 */
export interface MethodParameters {
  /** Массив параметров (может быть пустым). */
  MethodParameter?: MethodParameter | MethodParameter[];
}

/**
 * Описание публичной переменной операции.
 */
export interface MethodVariable {
  /** Имя переменной. */
  "@ShortName": string;
  /** ТБП переменной. */
  "@ClassID": string;
  /** Позиция. */
  "@Position": number;
  /** Тип ссылки. */
  "@ReferenceType": ReferenceType;
}

/**
 * Список публичных переменных.
 */
export interface MethodVariables {
  /** Массив переменных (может быть пустым). */
  MethodVariable?: MethodVariable | MethodVariable[];
}

/**
 * Описание элемента формы.
 */
export interface Control {
  /** Идентификатор элемента. */
  "@ID": number;
  /** Идентификатор операции. */
  "@MethodID": number;
  /** Квалификатор. */
  "@Qualifier": string;
  /** Тип элемента. */
  "@Control": ControlType;
  /** Заголовок. */
  "@Caption": string;
  /** Отступ сверху (пиксели). */
  "@Top": number;
  /** Отступ слева (пиксели). */
  "@Left": number;
  /** Высота (пиксели). */
  "@Height": number;
  /** Ширина (пиксели). */
  "@Width": number;
  /** Индекс табуляции. */
  "@TabIndex": number;
  /** Позиция. */
  "@Position": number;
  /** Имя для валидации. */
  "@ValidateName": string;
  /** Идентификатор родительского элемента (может отсутствовать). */
  "@ParentID"?: number;
  /** ТБП значения (опционально). */
  "@ClassID"?: string;
  /** Зависимость (опционально). */
  "@Depend"?: number;
  /** Свойства (опционально). */
  "@Properties"?: string;
  /** Подсказка (опционально). */
  "@Tips"?: string;
}

/**
 * Тип элемента формы.
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
  | "PANEL";

/**
 * Спиcок элементов на форме.
 */
export interface Controls {
  /** Массив элементов (может быть пустым). */
  Control?: Control | Control[];
}

/**
 * Результат выполнения блока `Validate`.
 */
export interface Validate {
  /** Отладочный текст. */
  "@DebugText": string;
  /** Состояния элементов (может быть один или несколько). */
  ControlsState?: ControlsState | ControlsState[];
}

/**
 * Состояние элемента на форме.
 */
export interface ControlsState {
  /** Идентификатор элемента. */
  "@ID": number;
  /** Значение элемента. */
  "@Value": string;
}

/**
 * Результат выполнения блока `Execute`.
 */
export interface MethodResult {
  /** Результат операции (число, может отсутствовать). */
  "@Value"?: number;
  /** Состояния элементов (может быть один или несколько). */
  ControlsState?: ControlsState | ControlsState[];
}

/**
 * Клиент-скрипт.
 */
export interface ClientScript {
  /** Текст скрипта. */
  "@Text": string;
}

/**
 * Информация об открытой форме.
 */
export interface MethodFrame {
  /** Идентификатор формы (может отсутствовать). */
  "@FrameID"?: number;
}

/**
 * Группа операций пользователя.
 */
export interface MethodsGroup {
  /** Идентификатор группы. */
  "@ID": number;
  /** Название группы. */
  "@Name": string;
}

/**
 * Список групп операций.
 */
export interface MethodsGroups {
  /** Массив групп (может быть пустым). */
  MethodsGroup?: MethodsGroup | MethodsGroup[];
}

//======================================================================================================================
// Представления и данные
//======================================================================================================================

/**
 * Пункт пользовательского меню.
 */
export interface UserMenuItem {
  /** Идентификатор пункта. */
  "@ID": number;
  /** Название пункта. */
  "@Name": string;
  /** ТБП. */
  "@ClassID": string;
  /** Идентификатор представления. */
  "@ViewID": string;
  /** Свойства. */
  "@Properties": string;
}

/**
 * Пользовательское меню.
 */
export interface UserMenu {
  /** Массив пунктов меню (может быть пустым). */
  UserMenuItem?: UserMenuItem | UserMenuItem[];
}

/**
 * Данные представления.
 */
export interface ViewData {
  /** Массив строк (может быть пустым). */
  Row?: Row | Row[];
}

/**
 * Строка данных представления.
 */
export interface Row {
  /** Массив элементов строки (может быть пустым). */
  RowItem?: RowItem | RowItem[];
}

/**
 * Значение колонки в строке.
 */
export interface RowItem {
  /** Имя колонки. */
  "@ColumnName": string;
  /** Значение. */
  "@Value": string;
}

/**
 * Описание колонки представления.
 */
export interface Column {
  /** Имя колонки. */
  "@Name": string;
  /** Ширина. */
  "@Width": number;
  /** Выравнивание. */
  "@Align": Align;
  /** Позиция. */
  "@Position": number;
  /** Квалификатор. */
  "@Qual": string;
  /** Псевдоним. */
  "@Alias": string;
  /** Базовый тип. */
  "@Base": ColumnBase;
  /** Изменяемый размер. */
  "@IsSizeable": number; // 0 или 1?
  /** Стиль ячейки. */
  "@IsCellStyle": number;
  /** Видимость. */
  "@IsInvisible": Invisible;
  /** Возможность выполнения операции. */
  "@AbilityPerformOperation": boolean;
  /** Редактируемость (опционально). */
  "@IsEditable"?: number;
  /** Идентификатор ссылки (опционально). */
  "@ReferenceID"?: string;
  /** Целевой ТБП (опционально). */
  "@TargetClassID"?: string;
  /** Тип ссылки (опционально). */
  "@ReferenceType"?: number;
  /** Логирование (опционально). */
  "@Logging"?: Logging;
}

/**
 * Базовый тип данных колонки.
 */
export type ColumnBase = "MEMO" | "DATE" | "STRING" | "NUMBER" | "BOOLEAN" | "REFERENCE" | "COLLECTION";

/**
 * Выравнивание.
 */
export type Align = 0 | 1 | 2; // 0-лево, 1-центр, 2-право

/**
 * Видимость.
 */
export type Invisible = 0 | 2; // 0-видимо, 2-скрыто

/**
 * Логирование.
 */
export type Logging = "0" | "D";

/**
 * Список колонок.
 */
export interface Columns {
  /** Массив колонок (может быть пустым). */
  Column?: Column | Column[];
}

/**
 * Описание представления.
 */
export interface View {
  /** Идентификатор. */
  "@ID": number;
  /** Название. */
  "@Name": string;
  /** Короткое имя. */
  "@ShortName": string;
  /** По умолчанию? (0/1) */
  "@IsDefault": number;
  /** Свойства. */
  "@Properties": string;
  /** Расстояние. */
  "@Distance": number;
  /** Права объекта. */
  "@ObjectRights": number;
  /** Печать. */
  "@ToPrinter": number;
  /** В файл. */
  "@ToFile": number;
  /** Сортировка (опционально). */
  "@OrderBy"?: string;
  /** Подсказки (опционально). */
  "@Hints"?: string;
  /** Скрипт стиля ячеек (опционально). */
  "@CellStyleScript"?: string;
  /** Идентификатор источника (опционально). */
  "@SourceID"?: number;
  /** Идентификатор расширения (опционально). */
  "@ExtensionID"?: number;
  /** Короткое имя метода фильтра (опционально). */
  "@FilterMethodShortName"?: string;
  /** Свойства метода фильтра (опционально). */
  "@FilterMethodProperties"?: string;
}

/**
 * Список представлений.
 */
export interface Views {
  /** Массив представлений (может быть пустым). */
  View?: View | View[];
}

//======================================================================================================================
// Навигация, справочники и меню
//======================================================================================================================

/**
 * Список справочников.
 */
export interface Guides {
  /** Массив классов-справочников (может быть пустым). */
  Class?: Class | Class[];
}

/**
 * Группа справочников.
 */
export interface GuidesGroup {
  /** Идентификатор группы. */
  "@ID": string;
  /** Название группы. */
  "@Name": string;
}

/**
 * Список групп справочников.
 */
export interface GuidesGroups {
  /** Массив групп (может быть пустым). */
  GuidesGroup?: GuidesGroup | GuidesGroup[];
}

/**
 * Список cправочников.
 */
export interface Classes {
  /** Массив классов (может быть пустым). */
  Class?: Class | Class[];
}

/**
 * Список ТПБ (не справочников).
 */
export interface Types {
  /** Массив классов (может быть пустым). */
  Class?: Class | Class[];
}

/**
 * Описание ТБП (класса).
 */
export interface Class {
  /** Короткое имя ТБП. */
  "@ID": string;
  /** Полное имя. */
  "@Name": string;
  /** Базовый ТБП. */
  "@BaseClassID": BaseClassID;
  /** Идентификатор сущности. */
  "@EntityID": string;
  /** Является типом ядра (0/1). */
  "@IsKernelType": string;
  /** Интерфейс класса. */
  "@ClassInterface": string;
  /** Флаги (строка из 25 символов). */
  "@Flags": string;
  /** Заголовок в меню (опционально). */
  "@MenuCaption"?: string;
  /** Доступность (0/1) (опционально). */
  "@IsAccessible"?: string;
  /** Длина отступа (опционально). */
  "@PadLength"?: string;
  /** Размер данных (опционально). */
  "@DataSize"?: string;
  /** Точность данных (опционально). */
  "@DataPrecision"?: string;
  /** Свойства (опционально). */
  "@Properties"?: string;
  /** Идентификатор группы (опционально). */
  "@GroupID"?: string;
}

export type BaseClassID = "STRUCTURE";

//======================================================================================================================
// Блокировки
//======================================================================================================================

/**
 * Результат блокировки экземпляра.
 */
export interface LockResult {
  /** Сообщение об ошибке (если блокировка не удалась). */
  "@Message"?: string;
}
