/**
 * Общая обёртка для любого XML-запроса.
 * @category XML
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
 * @category XML
 */
export type RequestBody =
  | { SessionInit: SessionInit }
  | { Disconnect: Disconnect }
  | { AuthenticationURLGet: AuthenticationURLGet }
  | { ProtocolInfoGet: ProtocolInfoGet }
  | { SystemServerVersionGet: SystemServerVersionGet }
  | { SystemCoreInfoGet: SystemCoreInfoGet }
  | { SystemContextInfoGet: SystemContextInfoGet }
  | { SystemSettingsGet: SystemSettingsGet }
  | { SystemSettingGet: SystemSettingGet }
  | { NovoAllowedCheck: NovoAllowedCheck }
  | { SystemOptionEnabledCheck: SystemOptionEnabledCheck }
  | { SystemInfoGet: SystemInfoGet }
  | { SystemLimitGet: SystemLimitGet }
  | { SystemContextGet: SystemContextGet }
  | { SystemApplicationNameGet: SystemApplicationNameGet }
  | { SystemHelpSystemInfoGet: SystemHelpSystemInfoGet }
  | { EmbeddedInteractionAvailableCheck: EmbeddedInteractionAvailableCheck }
  | { EmbeddedInteractionRequiredCheck: EmbeddedInteractionRequiredCheck }
  | { EmbeddedInteractionGetResource: EmbeddedInteractionGetResource }
  | { ContextInformationAvailableCheck: ContextInformationAvailableCheck }
  | { EmbeddedInteractionPost: EmbeddedInteractionPost }
  | { EmbeddedInteractionGet: EmbeddedInteractionGet }
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
  | { GuidesGet: GuidesGet }
  | { GuidesGroupsGet: GuidesGroupsGet }
  | { TypesGet: TypesGet }
  | { ObjectsLock: ObjectsLock }
  | { ObjectsUnlock: ObjectsUnlock };

//======================================================================================================================
// Сессия и информация о пользователе
//======================================================================================================================

/**
 * Запрос на инициализацию (активацию) сессии.
 * @category XML
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
 * @category XML
 */
export interface Disconnect {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос на получение URL для авторизации.
 * @category XML
 */
export type AuthenticationURLGet = Record<never, never>; // Пустой объект

/**
 * Запрос базовой информации о пользователе.
 * @category XML
 */
export interface UserInfoGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос проверки привилегий пользователя.
 * @category XML
 */
export interface SystemUserPrivilegedGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос свойства профиля пользователя.
 * @category XML
 */
export interface UserProfilePropertyGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Имя свойства (например, `"SESSIONS_PER_USER"`). */
  "@PropertyName": string;
}

/**
 * Запрос проверки вхождения пользователя в группу.
 * @category XML
 */
export interface UserBelongsGroupCheck {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор группы (например, `"ADMIN_GRP"`). */
  "@GroupID": string;
}

/**
 * Установка информации о сетевом окружении клиента.
 * @category XML
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
 * @category XML
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
// Информация о системе
//======================================================================================================================

/**
 * Запрос версии протокола API.
 * @category XML
 */
export type ProtocolInfoGet = Record<never, never>;

/**
 * Запрос версии сервера приложений.
 * @category XML
 */
export interface SystemServerVersionGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос информации о ядре системы.
 * @category XML
 */
export interface SystemCoreInfoGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос информации о системе.
 * @category XML
 */
export interface SystemContextInfoGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос всех системных настроек.
 * @category XML
 */
export interface SystemSettingsGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос конкретной системной настройки по имени.
 * @category XML
 */
export interface SystemSettingGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Имя настройки (например, `"SHOW_SYSTEM_MENU"`). */
  "@Name": string;
}

/**
 * Запрос проверки доступности `NOVO`.
 * @category XML
 */
export interface NovoAllowedCheck {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос проверки включения системной опции.
 * @category XML
 */
export interface SystemOptionEnabledCheck {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Имя опции (например, `"NAV_SKIN_INTERFACE"`). */
  "@OptionName": string;
}

/**
 * Запрос значения системного параметра
 * @category XML
 */
export interface SystemInfoGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Имя параметра (например, `"SYS_NAME"`). */
  "@ParameterName": string;
}

/**
 * Запрос значения системного ограничения (лимита).
 * @category XML
 */
export interface SystemLimitGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Имя лимита (например, `"SYS_NAME"`). */
  "@LimitName": string;
}

/**
 * Запрос значения атрибута системного контекста.
 * @category XML
 */
export interface SystemContextGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Именное пространство атрибута (например, `"SYS_NAME"`). */
  "@Namespace": string;
  /** Имя атрибута (например, `"SYS_VERSION"`). */
  "@AttributeName": string;
}

/**
 * Запрос имени текущего приложения
 * @category XML
 */
export interface SystemApplicationNameGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос на доступность контекстной информации.
 * @category XML
 */
export interface ContextInformationAvailableCheck {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос количества элементов в справочной системе.
 * @category XML
 */
export interface SystemHelpSystemInfoGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос доступности встроенного в "ЦФТ - Нафигатор" WebView модуля.
 * @category XML
 */
export interface EmbeddedInteractionAvailableCheck {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос на требование WebView модуля в текущем контексте.
 * @category XML
 */
export interface EmbeddedInteractionRequiredCheck {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос URL-адреса ресурса WebView модуля.
 * @category XML
 */
export interface EmbeddedInteractionGetResource {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Тип ошибки ресурса. */
  "@ErrorResponseType"?: string;
}

/**
 * Отправка сообщения в WebView-модуль.
 * @category XML
 */
export interface EmbeddedInteractionPost {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Наименование события запроса. */
  "@Request"?: string;
}

/**
 * Получние сообщение из WebView-модуля.
 * @category XML
 */
export interface EmbeddedInteractionGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Наименование события запроса. */
  "@Request"?: string;
}

//======================================================================================================================
// Отладка
//======================================================================================================================

/**
 * Запрос текста из отладочного канала (`Pipe`).
 * @category XML
 */
export interface PipeTextGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Имя канала (например, полученное из `Session.debugPipeName`). */
  "@PipeName": string;
}

/**
 * Запрос отладочного текста.
 * @category XML
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
 * @category XML
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
 * @category XML
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
 * @category XML
 */
export interface ClassTransitionsGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

/**
 * Запрос состояний ТБП.
 * @category XML
 */
export interface ClassStatesGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

/**
 * Запрос проверки необходимости `CollectionID` для ТБП.
 * @category XML
 */
export interface ClassNeedCollectionIDCheck {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

/**
 * Запрос дочерних ТБП.
 * @category XML
 */
export interface ClassChildrenGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя родительского ТБП. */
  "@ClassID": string;
}

/**
 * Информация о ТБП для запроса списка ТБП.
 * @category XML
 */
export interface ClassInfo {
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

/**
 * Запрос на получение списка ТБП.
 * @category XML
 */
export interface ClassesGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Массив объектов (может быть один или несколько). */
  ClassInfo: ClassInfo | ClassInfo[];
}

/**
 * Запрос на получение информации об ТБП.
 * @category XML
 */
export interface ClassGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

/**
 * Запрос списка справочников.
 * @category XML
 */
export interface GuidesGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос групп справочников.
 * @category XML
 */
export interface GuidesGroupsGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

/**
 * Запрос списка типов системы.
 * @category XML
 */
export interface TypesGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
}

//======================================================================================================================
// Операции
//======================================================================================================================

/**
 * Запрос операций ТБП.
 * @category XML
 */
export interface ClassMethodsGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

/**
 * Запрос на открытие формы операции.
 * @category XML
 */
export interface MethodBegin {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор операции. */
  "@MethodID": string;
}

/**
 * Запрос списка входных параметров операции.
 * @category XML
 */
export interface MethodParametersGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор операции. */
  "@MethodID": string;
}

/**
 * Запрос списка публичных переменных операции.
 * @category XML
 */
export interface MethodVariablesGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор операции. */
  "@MethodID": string;
}

/**
 * Запрос списка элементов формы операции.
 * @category XML
 */
export interface MethodControlsGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор формы. */
  "@FormID": string;
}

/**
 * Запрос групп операций пользователя для ТБП.
 * @category XML
 */
export interface ClassMethodsGroupsUserGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

/**
 * Запрос на получение клиент-скрипта операции.
 * @category XML
 */
export interface MethodClientScriptGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор операции. */
  "@MethodID": string;
}

/**
 * Запрос вызова блока `Validate` операции (по умолчанию, при открытии формы).
 * @category XML
 */
export interface MethodValidateDefault {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор операции. */
  "@MethodID": string;
  /** Значение переменной `P_INFO`. */
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
 * @category XML
 */
export interface MethodValidate {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор операции. */
  "@MethodID": string;
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
  /** Состояния элементов формы. */
  ControlsStates: ControlsStates;
  /** Параметры PLP-вызовов */
  PLPCallParameters: PLPCallParameter;
}

export type ValidateType = "VALIDATE";

/**
 * Состояния элементов формы.
 * @category XML
 */
export type ControlsStates = {
  /** Состояния элементов формы (может быть один или несколько). */
  ControlState: ControlState | ControlState[];
};

/**
 * Запрос на вызов блока `Execute` операции.
 * @category XML
 */
export interface MethodExecute {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор операции. */
  "@MethodID": string;
  /** Флаг подтверждения транзакции. */
  "@DoCommit": boolean;
  /** Оптимизированные обновления грида. */
  "@OptimizedGridUpdates": boolean;
  /** Состояния элементов формы. */
  ControlsStates: ControlsStates;
  /** Параметры PLP-вызовов (может быть один или несколько). */
  PLPCallParameters: PLPCallParameter;
}

/**
 * Состояние элемента управления на форме.
 * @category XML
 */
export interface ControlState {
  /** Идентификатор элемента. */
  "@ID": string;
  /** Значение элемента. */
  "@Value": string;
}

/**
 * Константа для PLP-вызова.
 * @category XML
 */
export interface PLPConstant {
  /** Значение константы. */
  "@Value": string;
}

/**
 * Переменная для PLP-вызова.
 * @category XML
 */
export interface PLPVariable {
  /** Идентификатор операции. */
  "@MethodID": string;
  /** Имя переменной. */
  "@Name": string;
}

/**
 * Параметр для PLP-вызова.
 * @category XML
 */
export interface PLPParameter {
  /** Идентификатор операции. */
  "@MethodID": string;
  /** Имя параметра. */
  "@Name": string;
}

/**
 * Объединённый тип сущности для PLP вызова.
 * @category XML
 */
export type PLPEntity = { PLPConstant: PLPConstant } | { PLPVariable: PLPVariable } | { PLPParameter: PLPParameter };

/**
 * Параметр PLP-вызова (источник и цель).
 * @category XML
 */
export interface PLPCallParameters {
  /** Исходная сущность PLP (может быть одна или несколько). */
  SourcePLPCallItem: PLPEntity | PLPEntity[];
  /** Целевая сущность PLP (может быть одна или несколько). */
  TargetPLPCallItem: PLPEntity | PLPEntity[];
}

/**
 * Параметры PLP-вызововов
 * @category XML
 */
export type PLPCallParameter = {
  /** Параметры PLP-вызовов (может быть один или несколько). */
  PLPCallParameter: PLPCallParameters | PLPCallParameters[];
};

/**
 * Запрос на завершение выполнения операции (закрытие формы).
 * @category XML
 */
export interface MethodEnd {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор формы, полученный из `MethodBegin`. */
  "@FrameID": string;
}

//======================================================================================================================
// Представления и данные
//======================================================================================================================

/**
 * Запрос представлений ТБП.
 * @category XML
 */
export interface ClassViewsGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

/**
 * Запрос данных представления с возможностью отмены.
 * @category XML
 */
export interface ViewDataGetCancelable {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Короткое имя представления. */
  "@ViewShortName": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
  /** Подсказка для оптимизатора (например, `"FIRST_ROWS"`). */
  "@Hint": string;
  /** Разрешить миллисекунды в метках времени. */
  "@AllowTimestampMilliseconds": boolean;
  /** Лимит строк (опционально). */
  "@RowsLimit"?: number;
  /** Сортировка по колонке (опционально, например, `"C_2 ASC"`). */
  "@OrderBy"?: string;
  /** Дополнительный фильтр (опционально). */
  AdditionalFilterBind?: AdditionalFilterBind;
  /** Фильтр по объекту (опционально). */
  ObjectFilter?: ObjectFilter;
  /** Пользовательский фильтр (опционально). */
  UserFilter?: UserFilter;
}

/**
 * Дополнительная привязка фильтра для представления.
 * @category XML
 */
export interface AdditionalFilterBind {
  /** Условие фильтрации (SQL-подобное выражение). */
  "@Clause": string;
}

/**
 * Фильтр по идентификатору экземпляра.
 * @category XML
 */
export interface ObjectFilter {
  /** Идентификатор экземпляра. */
  "@ObjectID": string;
}

/**
 * Простой фильтр для представления.
 * @category XML
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
 * @category XML
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
 * Объединённый тип фильтра для представления.
 * @category XML
 */
export type Filter =
  | { AND: Filter | Filter[] }
  | { OR: Filter | Filter[] }
  | { SimpleFilter: SimpleFilter }
  | { CaseInsensitiveFilter: CaseInsensitiveFilter };

/**
 * Пользовательский фильтр для представления.
 * @category XML
 */
export interface UserFilter {
  /** Дополнительный фильтр (опционально). */
  "@ExtraFilter"?: string;
  /** Логический оператор "AND" (опционально). */
  AND?: Filter | Filter[];
  // /** Логический оператор "OR" (опционально). */
  OR?: Filter | Filter[];
}

/**
 * Запрос колонок представления.
 * @category XML
 */
export interface ViewColumnsGet {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Идентификатор представления. */
  "@ViewID": string;
}

//======================================================================================================================
// Блокировки
//======================================================================================================================

/**
 * Описание экземпляра для блокировки.
 * @category XML
 */
export interface Object {
  /** Идентификатор экземпляра. */
  "@ID": string;
  /** Короткое имя ТБП. */
  "@ClassID": string;
}

/**
 * Запрос на блокировку одного или нескольких экземпляров.
 * @category XML
 */
export interface ObjectsLock {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Объекты для блокировки (один или несколько). */
  Object: Object | Object[];
}

/**
 * Запрос на разблокировку экземпляров.
 * @category XML
 */
export interface ObjectsUnlock {
  /** Идентификатор сессии. */
  "@SessionID": string;
  /** Если `true`, снимаются все блокировки; если `false` – только текущей сессии. */
  "@ClearAllLocks": boolean;
}
