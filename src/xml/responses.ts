/**
 * Базовая обертка XML-ответа от сервера.
 * @category XML
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
 * @category XML
 */
export type ResponseBody =
  | { Error: Error }
  | { Done: Done }
  | { Session: Session }
  | { ProtocolInfo: ProtocolInfo }
  | { ServerInfo: ServerInfo }
  | { CoreInfo: CoreInfo }
  | { SystemContextInfo: SystemContextInfo }
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
  | { Guides: Guides }
  | { GuidesGroups: GuidesGroups }
  | { Types: Types }
  | { PipeText: PipeText }
  | { DebugText: DebugText };

/**
 * @category Utility
 */
export type KeysOfUnion<T> = T extends any ? keyof T : never;

/**
 * @category Utility
 */
export type ResponseKey = KeysOfUnion<ResponseBody>;

/**
 * Вспомогательный тип: извлекает тип значения из `ResponseBody` по ключу `K`
 * @category XML
 */
export type ResponseValue<K extends ResponseKey> = K extends any ? Extract<ResponseBody, Record<K, any>>[K] : never;

/**
 * Ответ "Not Found" (пустой).
 * @category XML
 */
export type NotFound = "";

/**
 * Пустой ответ, подтверждающий успешное выполнение действия (например, отключение сессии).
 * @category XML
 */
export type Done = "";

/**
 * Структура ошибки API.
 * @category XML
 */
export interface Error {
  /** Текст ошибки. */
  "@Text": string;
  /** Детали. */
  ServerErrorInfo: ServerErrorInfo;
}

/**
 * Детали серверной ошибки.
 * @category XML
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
 * @category XML
 */
export interface Session {
  /** Идентификатор сессии. */
  "@ID": string;
  /** Имя отладочного канала. */
  "@DebugPipeName": string;
}

/**
 * Ответ с URL для авторизации.
 * @category XML
 */
export interface AuthenticationURL {
  /** Относительный URL для авторизации. */
  "@URL": string;
}

/**
 * Базовая информация о пользователе.
 * @category XML
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
 * @category XML
 */
export interface UserPrivileged {
  /** true, если пользователь привилегированный. */
  "@IsPrivileged": string;
}

/**
 * Значение свойства профиля пользователя.
 * @category XML
 */
export interface UserProfileProperty {
  /** Значение свойства. */
  "@Value": string;
}

/**
 * Универсальный результат проверки (например, вхождения в группу).
 * @category XML
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
 * @category XML
 */
export interface ProtocolInfo {
  /** Версия протокола (например, "9.54"). */
  "@Version": string;
}

/**
 * Информация о версии сервера.
 * @category XML
 */
export interface ServerInfo {
  /** Версия базы данных (например, "12.2.0.1"). */
  "@Version": string;
}

/**
 * Информация о ядре системы.
 * @category XML
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
 * Информация о системе.
 * @category XML
 */
export interface SystemContextInfo {
  /** Системная дата */
  "@SystemDate": string;
  /** Системное имя */
  "@SystemName": string;
  /** Дополнительная информация */
  "@SystemInfo": string;
}

/**
 * Список системных настроек.
 * @category XML
 */
export interface Settings {
  /** Массив настроек (может быть пустым). */
  Setting?: Setting | Setting[];
}

/**
 * Cистемная настройка (ключ-значение).
 * @category XML
 */
export interface Setting {
  /** Имя настройки. */
  "@Name": string;
  /** Значение настройки (может отсутствовать). */
  "@Value"?: string;
}

/**
 * Результат проверки доступности `NOVO`.
 * @category XML
 */
export interface NovoAllowedCheckResult {
  /** Строка `"true"` / `"false"` или `"1"` / `"0"` */
  "@Value": string;
}

/**
 * Информация о включенности системной опции.
 * @category XML
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
 * @category XML
 */
export interface PipeText {
  /** Текст из канала. */
  "@Value": string;
}

/**
 * Отладочный текст.
 * @category XML
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
 * @category XML
 */
export interface ObjectClassAndArchiveKey {
  /** Короткое имя текущего ТБП экземпляра. */
  "@ClassID"?: string;
  /** Ключ архива. */
  "@ArchiveKey"?: string;
}

/**
 * Обратная ссылка на экземпляр.
 * @category XML
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
 * @category XML
 */
export interface BackwardReferences {
  /** Массив обратных ссылок (может быть пустым). */
  BackwardReference?: BackwardReference | BackwardReference[];
}

/**
 * Переход состояний ТБП.
 * @category XML
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
 * @category XML
 */
export interface Transitions {
  /** Массив переходов (может быть пустым). */
  Transition?: Transition | Transition[];
}

/**
 * Состояние ТБП.
 * @category XML
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
 * @category XML
 */
export interface States {
  /** Массив состояний (может быть пустым). */
  State?: State | State[];
}

/**
 * Дочерний ТБП.
 * @category XML
 */
export interface ChildClass {
  /** Короткое имя дочернего ТБП. */
  "@ID": string;
}

/**
 * Список дочерних ТБП.
 * @category XML
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
 * @category XML
 */
export interface Method {
  /** Идентификатор операции. */
  "@ID": string;
  /** Полное наименование. */
  "@Name": string;
  /** Короткое имя. */
  "@ShortName": string;
  /** Тип операции. */
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
 * `O` - выбор.
 * `P` — печать.
 *
 * @category XML
 */
export type MethodType = "C" | "G" | "M" | "R" | "S" | "Y" | "O" | "P";

/**
 * Список операций.
 * @category XML
 */
export interface Methods {
  /** Массив операций (может быть пустым). */
  Method?: Method | Method[];
}

/**
 * Описание входного параметра операции.
 * @category XML
 */
export interface MethodParameter {
  /** Короткое имя параметра. */
  "@ShortName": string;
  /** ТБП параметра. */
  "@ClassID": string;
  /** Позиция. */
  "@Position": string;
  /** Тип ссылки. */
  "@ReferenceType": ReferenceType;
  /** Направление. */
  "@Direction": Direction;
  /** Идентификатор представления (опционально). */
  "@ViewID"?: string;
  /** Класс представления (опционально). */
  "@ViewClassID"?: string;
  /** Фильтр представления (опционально). */
  "@ViewFilter"?: string;
  /** Значение по умолчанию (опционально). */
  "@DefaultValue"?: string;
}

/**
 * Тип ссылки.
 *
 * `D` — `default`.
 * `T` — `table of`.
 * `R` — `ref`.
 *
 * @category XML
 */
export type ReferenceType = "D" | "T" | "R";

/**
 * Направление параметра.
 * @category XML
 *
 * `I` — `in`.
 * `D` — `default`.
 * `B` — `in out`.
 * `O` — `out`.
 *
 * @category XML
 */
export type Direction = "D" | "I" | "B" | "O";

/**
 * Список входных параметров.
 * @category XML
 */
export interface MethodParameters {
  /** Массив параметров (может быть пустым). */
  MethodParameter?: MethodParameter | MethodParameter[];
}

/**
 * Описание публичной переменной операции.
 * @category XML
 */
export interface MethodVariable {
  /** Имя переменной. */
  "@ShortName": string;
  /** ТБП переменной. */
  "@ClassID": string;
  /** Позиция. */
  "@Position": string;
  /** Тип ссылки. */
  "@ReferenceType": ReferenceType;
}

/**
 * Список публичных переменных.
 * @category XML
 */
export interface MethodVariables {
  /** Массив переменных (может быть пустым). */
  MethodVariable?: MethodVariable | MethodVariable[];
}

/**
 * Описание элемента формы.
 * @category XML
 */
export interface Control {
  /** Идентификатор элемента. */
  "@ID": string;
  /** Идентификатор операции. */
  "@MethodID": string;
  /** Квалификатор. */
  "@Qualifier": string;
  /** Тип элемента. */
  "@Control": ControlType;
  /** Заголовок. */
  "@Caption": string;
  /** Отступ сверху (пиксели). */
  "@Top": string;
  /** Отступ слева (пиксели). */
  "@Left": string;
  /** Высота (пиксели). */
  "@Height": string;
  /** Ширина (пиксели). */
  "@Width": string;
  /** Индекс табуляции. */
  "@TabIndex": string;
  /** Позиция. */
  "@Position": string;
  /** Имя для валидации. */
  "@ValidateName": string;
  /** Идентификатор родительского элемента (может отсутствовать). */
  "@ParentID"?: string;
  /** ТБП значения (опционально). */
  "@ClassID"?: string;
  /** Зависимость (опционально). */
  "@Depend"?: string;
  /** Свойства (опционально). */
  "@Properties"?: string;
  /** Подсказка (опционально). */
  "@Tips"?: string;
}

/**
 * Тип элемента формы.
 * @category XML
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
 * @category XML
 */
export interface Controls {
  /** Массив элементов (может быть пустым). */
  Control?: Control | Control[];
}

/**
 * Результат выполнения блока `Validate`.
 * @category XML
 */
export interface Validate {
  /** Отладочный текст. */
  "@DebugText"?: string;
  /** ID объекта */
  "@ObjectID"?: string;
  /** Состояния элементов (может быть один или несколько). */
  ControlsState?: ControlsState | ControlsState[];
}

/**
 * Состояние элемента на форме.
 * @category XML
 */
export interface ControlsState {
  /** Идентификатор элемента. */
  "@ID": string;
  /** Значение элемента. */
  "@Value": string;
}

/**
 * Результат выполнения блока `Execute`.
 * @category XML
 */
export interface MethodResult {
  /** Результат операции (число, может отсутствовать). */
  "@Value"?: string;
  /** Состояния элементов (может быть один или несколько). */
  ControlsState?: ControlsState | ControlsState[];
}

/**
 * Клиент-скрипт.
 * @category XML
 */
export interface ClientScript {
  /** Текст скрипта. */
  "@Text": string;
}

/**
 * Информация об открытой форме.
 * @category XML
 */
export interface MethodFrame {
  /** Идентификатор формы (может отсутствовать). */
  "@FrameID"?: string;
}

//======================================================================================================================
// Представления и данные
//======================================================================================================================

/**
 * Данные представления.
 * @category XML
 */
export interface ViewData {
  /** Массив строк (может быть пустым). */
  Row?: Row | Row[];
}

/**
 * Строка данных представления.
 * @category XML
 */
export interface Row {
  /** Массив элементов строки (может быть пустым). */
  RowItem?: RowItem | RowItem[];
}

/**
 * Значение колонки в строке.
 * @category XML
 */
export interface RowItem {
  /** Имя колонки. */
  "@ColumnName": string;
  /** Значение. */
  "@Value": string;
}

/**
 * Описание колонки представления.
 * @category XML
 */
export interface Column {
  /** Имя колонки. */
  "@Name": string;
  /** Ширина. */
  "@Width": string;
  /** Выравнивание. */
  "@Align": Align;
  /** Позиция. */
  "@Position": string;
  /** Квалификатор. */
  "@Qual": string;
  /** Псевдоним. */
  "@Alias": string;
  /** Базовый тип. */
  "@Base": ColumnBase;
  /** Изменяемый размер. */
  "@IsSizeable": string; // 0 или 1?
  /** Видимость. */
  "@IsInvisible": Invisible;
  /** Возможность выполнения операции. */
  "@AbilityPerformOperation": string;
  /** Стиль ячейки. (опционально) */
  "@IsCellStyle"?: string;
  /** Редактируемость (опционально). */
  "@IsEditable"?: string;
  /** Идентификатор ссылки (опционально). */
  "@ReferenceID"?: string;
  /** Целевой ТБП (опционально). */
  "@TargetClassID"?: string;
  /** Тип ссылки (опционально). */
  "@ReferenceType"?: string;
  /** Логирование (опционально). */
  "@Logging"?: Logging;
}

/**
 * Базовый тип данных колонки.
 * @category XML
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
 * @category XML
 */
export type Align = "0" | "1" | "2";

/**
 * Видимость.
 *
 * - 0-видимо
 * - 2-скрыто
 *
 * @category XML
 */
export type Invisible = "0" | "2";

/**
 * Логирование.
 * @category XML
 */
export type Logging = "0" | "D";

/**
 * Список колонок.
 * @category XML
 */
export interface Columns {
  /** Массив колонок (может быть пустым). */
  Column?: Column | Column[];
}

/**
 * Описание представления.
 * @category XML
 */
export interface View {
  /** Идентификатор. */
  "@ID": string;
  /** Название. */
  "@Name": string;
  /** Короткое имя. */
  "@ShortName": string;
  /** По умолчанию? (`0` / `1`) */
  "@IsDefault": string;
  /** Свойства. */
  "@Properties": string;
  /** Расстояние. */
  "@Distance": string;
  /** Права объекта. */
  "@ObjectRights": string;
  /** Печать. */
  "@ToPrinter": string;
  /** В файл. */
  "@ToFile": string;
  /** Сортировка (опционально). */
  "@OrderBy"?: string;
  /** Подсказки (опционально). */
  "@Hints"?: string;
  /** Скрипт стиля ячеек (опционально). */
  "@CellStyleScript"?: string;
  /** Идентификатор источника (опционально). */
  "@SourceID"?: string;
  /** Идентификатор расширения (опционально). */
  "@ExtensionID"?: string;
  /** Короткое имя метода фильтра (опционально). */
  "@FilterMethodShortName"?: string;
  /** Свойства метода фильтра (опционально). */
  "@FilterMethodProperties"?: string;
}

/**
 * Список представлений.
 * @category XML
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
 * @category XML
 */
export interface Guides {
  /** Массив классов-справочников (может быть пустым). */
  Class?: Class | Class[];
}

/**
 * Группа справочников.
 * @category XML
 */
export interface GuidesGroup {
  /** Идентификатор группы. */
  "@ID": string;
  /** Название группы. */
  "@Name": string;
}

/**
 * Список групп справочников.
 * @category XML
 */
export interface GuidesGroups {
  /** Массив групп (может быть пустым). */
  GuidesGroup?: GuidesGroup | GuidesGroup[];
}

/**
 * Список cправочников.
 * @category XML
 */
export interface Classes {
  /** Массив классов (может быть пустым). */
  Class?: Class | Class[];
}

/**
 * Список ТПБ (не справочников).
 * @category XML
 */
export interface Types {
  /** Массив классов (может быть пустым). */
  Class?: Class | Class[];
}

/**
 * Описание ТБП (класса).
 * @category XML
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
/**
 * @category XML
 */
export type BaseClassID = "STRUCTURE";

//======================================================================================================================
// Блокировки
//======================================================================================================================

/**
 * Результат блокировки экземпляра.
 * @category XML
 */
export interface LockResult {
  /** Сообщение об ошибке (если блокировка не удалась). */
  "@Message"?: string;
}
