/**
 * Общая обёртка для любого XML-запроса.
 */
export type Request = {
  "?xml": {
    "@version": "1.0";
    "@encoding": "UTF-8";
    "@standalone": "yes";
  };
  Request: RequestBody;
};

/**
 * Объединённый тип для тела запроса.
 */
export type RequestBody =
  | { SessionInit: SessionInit }
  | { Disconnect: Disconnect }
  | { AuthenticationURLGet: AuthenticationURLGet }
  | { ProtocolInfoGet: ProtocolInfoGet }
  | { SystemServerVersionGet: SystemServerVersionGet }
  | { SystemCoreInfoGet: SystemCoreInfoGet }
  | { SystemSettingsGet: SystemSettingsGet }
  | { SystemSettingGet: SystemSettingGet }
  | { NovoAllowedCheck: NovoAllowedCheck }
  | { SystemOptionEnabledCheck: SystemOptionEnabledCheck }
  | { NetworkInformationSet: NetworkInformationSet }
  | { SystemNetAddressSet: SystemNetAddressSet }
  | { UserInfoGet: UserInfoGet }
  | { SystemUserPrivilegedGet: SystemUserPrivilegedGet }
  | { UserProfilePropertyGet: UserProfilePropertyGet }
  | { UserBelongsGroupCheck: UserBelongsGroupCheck }
  | { PipeTextGet: PipeTextGet }
  | { DebugTextGet: DebugTextGet }
  | { ObjectClassAndArchiveKeyGet: ObjectClassAndArchiveKeyGet }
  | { ObjectBackwardReferencesGet: ObjectBackwardReferencesGet }
  | { ClassTransitionsGet: ClassTransitionsGet }
  | { ClassStatesGet: ClassStatesGet }
  | { ClassNeedCollectionIDCheck: ClassNeedCollectionIDCheck }
  | { ClassChildrenGet: ClassChildrenGet }
  | { ClassesGet: ClassesGet }
  | { ClassGet: ClassGet }
  | { ClassMethodsGet: ClassMethodsGet }
  | { MethodBegin: MethodBegin }
  | { MethodParametersGet: MethodParametersGet }
  | { MethodVariablesGet: MethodVariablesGet }
  | { MethodControlsGet: MethodControlsGet }
  | { ClassMethodsGroupsUserGet: ClassMethodsGroupsUserGet }
  | { MethodClientScriptGet: MethodClientScriptGet }
  | { MethodValidateDefault: MethodValidateDefault }
  | { MethodValidate: MethodValidate }
  | { MethodExecute: MethodExecute }
  | { MethodEnd: MethodEnd }
  | { ViewDataGetCancelable: ViewDataGetCancelable }
  | { ViewColumnsGet: ViewColumnsGet }
  | { ClassViewsGet: ClassViewsGet }
  | { UserMenuGet: UserMenuGet }
  | { GuidesGet: GuidesGet }
  | { GuidesGroupsGet: GuidesGroupsGet }
  | { TypesGet: TypesGet }
  | { ObjectsLock: ObjectsLock }
  | { ObjectsUnlock: ObjectsUnlock };

//======================================================================================================================
// Сессия и авторизация
//======================================================================================================================

/**
 * Запрос на инициализацию (активацию) сессии.
 */
export interface SessionInit {
  /**
   * Флаг, указывающий, следует ли поддерживать активную сессию.
   * @optional
   */
  "@AliveActiveSession"?: boolean;
}

/**
 * Запрос на деактивацию (завершение) сессии.
 */
export interface Disconnect {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос на получение URL для авторизации.
 */
export type AuthenticationURLGet = Record<never, never>; // Пустой объект

//======================================================================================================================
// Информация о системе
//======================================================================================================================

/**
 * Запрос версии протокола API.
 */
export type ProtocolInfoGet = Record<never, never>; // Пустой объект

/**
 * Запрос версии сервера приложений.
 */
export interface SystemServerVersionGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос информации о ядре системы.
 */
export interface SystemCoreInfoGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос всех системных настроек.
 */
export interface SystemSettingsGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос конкретной системной настройки по имени.
 */
export interface SystemSettingGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Имя настройки (например, "SHOW_SYSTEM_MENU"). */
  "@Name": string;
}

/**
 * Запрос проверки доступности NOVO.
 */
export interface NovoAllowedCheck {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос проверки включения системной опции.
 */
export interface SystemOptionEnabledCheck {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Имя опции (например, "NAV_SKIN_INTERFACE"). */
  "@OptionName": string;
}

/**
 * Установка информации о сетевом окружении клиента.
 */
export interface NetworkInformationSet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Hostname устройства пользователя. */
  "@ClientName": string;
  /** Локальный IP‑адрес. */
  "@ClientIP": string;
  /** Имя пользователя ОС (например, из `whoami`). */
  "@ClientUser": string;
  /** Название клиентского приложения (например, "ЦФТ - Навигатор 6.0"). */
  "@ModuleName": string;
}

/**
 * Установка MAC и IP адресов клиента.
 */
export interface SystemNetAddressSet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** MAC‑адрес устройства (например, "aa:bb:cc:dd:ee:ff"). */
  "@MACAddress": string;
  /** Локальный IP‑адрес. */
  "@IPAddress": string;
}

//======================================================================================================================
// Информация о пользователе
//======================================================================================================================

/**
 * Запрос базовой информации о пользователе.
 */
export interface UserInfoGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос проверки привилегий пользователя.
 */
export interface SystemUserPrivilegedGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос свойства профиля пользователя.
 */
export interface UserProfilePropertyGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Имя свойства (например, "SESSIONS_PER_USER"). */
  "@PropertyName": string;
}

/**
 * Запрос проверки вхождения пользователя в группу.
 */
export interface UserBelongsGroupCheck {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор группы (например, "ADMIN_GRP"). */
  "@GroupID": string;
}

//======================================================================================================================
// Отладка
//======================================================================================================================

/**
 * Запрос текста из отладочного канала (Pipe).
 */
export interface PipeTextGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Имя канала (например, полученное из `Session.debugPipeName`). */
  "@PipeName": string;
}

/**
 * Запрос отладочного текста.
 */
export interface DebugTextGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Направление отладки. */
  "@Direction": string;
}

//======================================================================================================================
// ТБП и их экземпляры
//======================================================================================================================

/**
 * Запрос ТБП и ключа архива для экземпляра.
 */
export interface ObjectClassAndArchiveKeyGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор экземпляра. */
  "@ObjectID": number;
  /** Короткое имя базового ТБП (например, "DOCUMENT"). */
  "@BaseClassID": string;
}

/**
 * Запрос обратных ссылок на экземпляр.
 */
export interface ObjectBackwardReferencesGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор экземпляра. */
  "@ObjectID": number;
  /** Короткое имя ТБП, к которому принадлежит экземпляр. */
  "@ClassID": string;
}

/**
 * Запрос переходов состояний ТБП.
 */
export interface ClassTransitionsGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

/**
 * Запрос состояний ТБП.
 */
export interface ClassStatesGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

/**
 * Запрос проверки необходимости `CollectionID` для ТБП.
 */
export interface ClassNeedCollectionIDCheck {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

/**
 * Запрос дочерних ТБП.
 */
export interface ClassChildrenGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя родительского ТБП. */
  "@ClassID": string;
}

/**
 * Информация о ТБП для запроса списка ТБП.
 */
export interface ClassInfo {
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

/**
 * Запрос на получение списка ТБП.
 */
export interface ClassesGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Массив объектов ClassInfo (может быть один или несколько). */
  ClassInfo: ClassInfo | ClassInfo[];
}

/**
 * Запрос на получение информации об ТБП.
 */
export interface ClassGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

//======================================================================================================================
// Операции
//======================================================================================================================

/**
 * Запрос операций ТБП.
 */
export interface ClassMethodsGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

/**
 * Запрос на открытие формы операции.
 */
export interface MethodBegin {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор операции. */
  "@MethodID": number;
}

/**
 * Запрос списка входных параметров операции.
 */
export interface MethodParametersGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор операции. */
  "@MethodID": number;
}

/**
 * Запрос списка публичных переменных операции.
 */
export interface MethodVariablesGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор операции. */
  "@MethodID": number;
}

/**
 * Запрос списка элементов формы операции.
 */
export interface MethodControlsGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор формы. */
  "@FormID": number;
}

/**
 * Запрос групп операций пользователя для ТБП.
 */
export interface ClassMethodsGroupsUserGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

/**
 * Запрос на получение клиент-скрипта операции.
 */
export interface MethodClientScriptGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор операции. */
  "@MethodID": number;
}

/**
 * Запрос вызова блока `Validate` операции (по умолчанию, при открытии формы).
 */
export interface MethodValidateDefault {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор операции. */
  "@MethodID": number;
  /** Значение переменной P_INFO. */
  "@Info": string;
  /** Флаг подтверждения транзакции. */
  "@DoCommit": boolean;
  /** Строка с идентификаторами объектов через запятую (например, "1,2,3"). */
  "@ObjectID": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
  /** Уровень отладки. */
  "@DebugLevel": number;
  /** Вызывается ли операция из другой операции. */
  "@IsCalledFromAnotherMethod": boolean;
  /** Флаг только для чтения. */
  "@ReadOnly": boolean;
  /** Идентификатор ТБП для блокировки (опционально). */
  "@LockObjectClassID"?: string;
  /** Получать ли отладочный текст. */
  "@GetDebugText": boolean;
  /** Оптимизированные обновления грида. */
  "@OptimizedGridUpdates": boolean;
}

/**
 * Запрос на вызов блока `Validate` операции при событии элемента формы.
 */
export interface MethodValidate {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор операции. */
  "@MethodID": number;
  /** Тип валидации. */
  "@Type": ValidateType;
  /** Значение переменной P_INFO. */
  "@Info": string;
  /** Флаг подтверждения транзакции. */
  "@DoCommit": boolean;
  /** Получать ли отладочный текст. */
  "@GetDebugText": boolean;
  /** Оптимизированные обновления грида. */
  "@OptimizedGridUpdates": boolean;
  /** Состояния элементов управления (может быть один или несколько). */
  ControlsStates: ControlState | ControlState[];
  /** Параметры PLP-вызовов (может быть один или несколько). */
  PLPCallParameters: PLPCallParameter | PLPCallParameter[];
}

export type ValidateType = "VALIDATE";

/**
 * Запрос на вызов блока `Execute` операции.
 */
export interface MethodExecute {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор операции. */
  "@MethodID": number;
  /** Флаг подтверждения транзакции. */
  "@DoCommit": boolean;
  /** Оптимизированные обновления грида. */
  "@OptimizedGridUpdates": boolean;
  /** Состояния элементов управления (может быть один или несколько). */
  ControlsStates: ControlState | ControlState[];
  /** Параметры PLP-вызовов (может быть один или несколько). */
  PLPCallParameters: PLPCallParameter | PLPCallParameter[];
}

/**
 * Состояние элемента управления на форме.
 */
export interface ControlState {
  /** Идентификатор элемента. */
  "@ID": number;
  /** Значение элемента. */
  "@Value": string;
}

/**
 * Константа для PLP-вызова.
 */
export interface PLPConstant {
  /** Значение константы. */
  "@Value": string;
}

/**
 * Переменная для PLP-вызова.
 */
export interface PLPVariable {
  /** Идентификатор операции. */
  "@MethodID": number;
  /** Имя переменной. */
  "@Name": string;
}

/**
 * Параметр для PLP-вызова.
 */
export interface PLPParameter {
  /** Идентификатор операции. */
  "@MethodID": number;
  /** Имя параметра. */
  "@Name": string;
}

/**
 * Объединённый тип сущности для PLP вызова.
 */
export type PLPEntity = PLPConstant | PLPVariable | PLPParameter;

/**
 * Параметр PLP-вызова (источник и цель).
 */
export interface PLPCallParameter {
  /** Исходная сущность PLP (может быть одна или несколько). */
  SourcePLPCallItem: PLPEntity | PLPEntity[];
  /** Целевая сущность PLP (может быть одна или несколько). */
  TargetPLPCallItem: PLPEntity | PLPEntity[];
}

/**
 * Запрос на завершение выполнения операции (закрытие формы).
 */
export interface MethodEnd {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор формы, полученный из `MethodBegin`. */
  "@FrameID": number;
}

//======================================================================================================================
// Представления и данные
//======================================================================================================================

/**
 * Запрос данных представления с возможностью отмены.
 */
export interface ViewDataGetCancelable {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя представления. */
  "@ViewShortName": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
  /** Подсказка для оптимизатора (например, "FIRST_ROWS"). */
  "@Hint": string;
  /** Разрешить миллисекунды в метках времени. */
  "@AllowTimestampMilliseconds": boolean;
  /** Лимит строк (опционально). */
  "@RowsLimit"?: number;
  /** Дополнительный фильтр (опционально). */
  AdditionalFilterBind?: AdditionalFilterBind;
  /** Фильтр по объекту (опционально). */
  ObjectFilter?: ObjectFilter;
  /** Пользовательский фильтр (опционально). */
  UserFilter?: UserFilter;
}

/**
 * Дополнительная привязка фильтра для представления.
 */
export interface AdditionalFilterBind {
  /** Условие фильтрации (SQL-подобное выражение). */
  "@Clause": string;
}

/**
 * Фильтр по идентификатору экземпляра.
 */
export interface ObjectFilter {
  /** Идентификатор экземпляра. */
  "@ObjectID": number;
}

/**
 * Простой фильтр для представления.
 */
export interface SimpleFilter {
  /** Имя колонки. */
  "@ColumnName": string;
  /** Оператор сравнения (например, "=", "LIKE"). */
  "@Operator": string;
  /** Значение для сравнения (опционально). */
  "@Value"?: string;
}

/**
 * Регистронезависимый фильтр для представления.
 */
export interface CaseInsensitiveFilter {
  /** Имя колонки. */
  "@ColumnName": string;
  /** Оператор сравнения. */
  "@Operator": string;
  /** Значение для сравнения (опционально). */
  "@Value"?: string;
}

/**
 * Логический фильтр "AND".
 */
export interface AndFilter {
  /** Вложенные фильтры (один или несколько). */
  AND: Filter | Filter[];
}

/**
 * Логический фильтр "OR".
 */
export interface OrFilter {
  /** Вложенные фильтры (один или несколько). */
  OR: Filter | Filter[];
}

/**
 * Объединённый тип фильтра для представления.
 */
export type Filter = AndFilter | OrFilter | SimpleFilter | CaseInsensitiveFilter;

/**
 * Пользовательский фильтр для представления.
 */
export interface UserFilter {
  /** Дополнительный фильтр (опционально). */
  "@ExtraFilter"?: string;
  /** Список фильтров (один или несколько). */
  Filter: Filter | Filter[];
}

/**
 * Запрос колонок представления.
 */
export interface ViewColumnsGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор представления. */
  "@ViewID": number;
}

/**
 * Запрос представлений ТБП.
 */
export interface ClassViewsGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

//======================================================================================================================
// Навигация, справочники и меню
//======================================================================================================================

/**
 * Запрос пользовательского меню представлений.
 */
export interface UserMenuGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос списка справочников.
 */
export interface GuidesGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос групп справочников.
 */
export interface GuidesGroupsGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос списка всех ТБП (не справочников) системы.
 */
export interface TypesGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

//======================================================================================================================
// Блокировки
//======================================================================================================================

/**
 * Описание экземпляра для блокировки.
 */
export interface Object {
  /** Идентификатор экземпляра. */
  "@ID": number;
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

/**
 * Запрос на блокировку одного или нескольких экземпляров.
 */
export interface ObjectsLock {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Объекты для блокировки (один или несколько). */
  Object: Object | Object[];
}

/**
 * Запрос на разблокировку экземпляров.
 */
export interface ObjectsUnlock {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Если true, снимаются все блокировки; если false – только текущей сессии. */
  "@ClearAllLocks": boolean;
}
