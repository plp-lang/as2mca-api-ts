import { XMLParser } from "fast-xml-parser";
import XMLBuilder from "fast-xml-builder";

import { ApiError, HttpError, UnexpectedResponseError, XmlDeserializeError, XmlSerializeError } from "./error";

import type { HttpAdapter } from "./http-adapter";
import { FetchHttpAdapter } from "./fetch-http-adapter";
import type {
  BackwardReference,
  ChildClass,
  Class,
  Column,
  CoreInfo,
  Filter,
  GuidesGroup,
  Method,
  MethodExecute,
  MethodParameter,
  MethodResult,
  MethodValidate,
  MethodValidateDefault,
  MethodVariable,
  NetworkInformationSet,
  ObjectClassAndArchiveKey,
  PLPEntity,
  RowItem,
  SessionInfo,
  Setting,
  State,
  SystemNetAddressSet,
  Transition,
  UserInfo,
  Validate,
  View,
  ViewDataGetCancelable,
  Object,
  Control,
  SystemContextInfo,
} from "./models";
import type { xml } from ".";

/**
 * Клиент для взаимодействия с API сервера приложений.
 *
 * Содержит HTTP‑клиент и базовый URL. Все методы выполняют POST‑запросы на эндпоинт `/api`
 * с XML‑телом, соответствующим структурам из модуля `requests`.
 *
 * Для работы требуется **активная сессия**, полученная через {@link Client.authbasic} и {@link Client.sessionInit}.
 */
export class Client {
  private readonly httpAdapter: HttpAdapter;

  /**
   * Базовый конструктор, с {@link HttpAdapter} по умолчанию {@link FetchHttpAdapter}.
   */
  constructor(
    private readonly baseUrl: string,
    httpAdapter?: HttpAdapter,
  ) {
    this.httpAdapter = httpAdapter ?? new FetchHttpAdapter();
  }

  //====================================================================================================================
  // Сессия и информация о пользователе
  //====================================================================================================================

  /**
   * Выполняет HTTP Basic‑авторизацию на сервере.
   *
   * @category Session
   * @description
   * Сервер в любом случае устанавливает cookie `JSESSIONID` (даже при неверных учётных данных),
   * поэтому этот метод не возвращает ошибку при неудачной аутентификации.
   * Для проверки успешности следует вызвать {@link sessionInit}.
   *
   * @remarks
   * После вызова этого метода сервер установит `JSESSIONID` в cookie клиента.
   * Для активации сессии необходимо вызвать {@link sessionInit}.
   *
   * @param username - Имя пользователя.
   * @param password - Пароль.
   * @returns Ответа нет
   *
   * @example
   * ```typescript
   * const client = new Client("http://localhost:3000/platform2mca/");
   * await client.authbasic('admin', 'password');
   *
   * const session = await client.sessionInit();
   * console.log('Session ID: ', session.sessionId);
   *
   * await client.sessionDeinit(session.sessionId);
   * ```
   * @throws {HttpError}
   * Возможные ошибки:
   * - {@link HttpError}: При сетевых проблемах
   */
  public async authbasic(username: string, password: string): Promise<void> {
    const url = this.endpoint("authbasic");
    const { status, statusText } = await this.httpAdapter.authbasic(url, {
      authorization: "Basic " + btoa(username + ":" + password),
    });
    if (status < 200 || status >= 300) {
      throw new HttpError(statusText, status, url);
    }
  }

  /**
   * Активирует сессию, проверяя валидность учётных данных.
   *
   * @category Session
   * @description
   * После успешного вызова возвращается структура {@link SessionInfo}, содержащая `sessionId`
   * и имя отладочного канала (`debugPipeName`).
   *
   * @param aliveActiveSession - Флаг, указывающий, следует ли поддерживать активную сессию (опционально).
   * @returns Данные сессии {@link SessionInfo}.
   *
   * @example
   * ```typescript
   * const client = new Client("http://localhost:3000/platform2mca/");
   * await client.authbasic('admin', 'password');
   *
   * const session = await client.sessionInit();
   * console.log('Session ID: ', session.sessionId);
   *
   * await client.sessionDeinit(session.sessionId);
   * ```
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async sessionInit(aliveActiveSession?: boolean): Promise<SessionInfo> {
    const { "@ID": sessionId, "@DebugPipeName": debugPipeName } = await this.api("Session", {
      SessionInit: {
        "@AliveActiveSession": aliveActiveSession,
      },
    });
    return { sessionId, debugPipeName };
  }

  /**
   * Деактивирует сессию, делая её недействительной.
   *
   * @category Session
   * @remarks
   * После вызова все последующие запросы с этим `sessionId` будут отклонены.
   *
   * @param sessionId - Идентификатор сессии, полученный из {@link SessionInfo.sessionId}.
   *
   * @example
   * ```typescript
   * const client = new Client("http://localhost:3000/platform2mca/");
   * await client.authbasic('admin', 'password');
   *
   * const session = await client.sessionInit();
   * console.log('Session ID: ', session.sessionId);
   *
   * await client.sessionDeinit(session.sessionId);
   * ```
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async sessionDeinit(sessionId: string): Promise<void> {
    await this.api("Done", {
      Disconnect: {
        "@SessionID": sessionId,
      },
    });
  }

  /**
   * Проверяет, является ли текущий пользователь привилегированным.
   *
   * @category Session
   * @param sessionId - Идентификатор сессии.
   * @returns `true`, если пользователь имеет привилегии.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async systemUserPrivilegedGet(sessionId: string): Promise<boolean> {
    const user = await this.api("User", {
      SystemUserPrivilegedGet: { "@SessionID": sessionId },
    });
    const isPrivileged = (user as xml.UserPrivileged)["@IsPrivileged"];
    return normalizeBool(isPrivileged);
  }

  /**
   * Возвращает детальную информацию о пользователе.
   *
   * @category Session
   * @param sessionId - Идентификатор сессии.
   * @returns Объект {@link UserInfo}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async userInfoGet(sessionId: string): Promise<UserInfo> {
    const user = (await this.api("User", {
      UserInfoGet: { "@SessionID": sessionId },
    })) as xml.UserInfo;
    return {
      name: user["@Name"],
      shortName: user["@ShortName"],
      properties: user["@Properties"],
    };
  }

  /**
   * Получает значение свойства профиля пользователя по его имени.
   *
   * @category Session
   * @param sessionId - Идентификатор сессии.
   * @param propertyName - Имя свойства (например, `"SESSIONS_PER_USER"`).
   * @returns Значение свойства в виде строки.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async userProfilePropertyGet(sessionId: string, propertyName: string): Promise<string> {
    const result = await this.api("UserProfileProperty", {
      UserProfilePropertyGet: { "@SessionID": sessionId, "@PropertyName": propertyName },
    });
    return result["@Value"];
  }

  /**
   * Проверяет, входит ли пользователь в указанную группу.
   *
   * @category Session
   * @param sessionId - Идентификатор сессии.
   * @param groupId - Идентификатор группы (например, `"ADMIN_GRP"`).
   * @returns `true`, если пользователь является членом группы.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async userBelongsGroupCheck(sessionId: string, groupId: string): Promise<boolean> {
    const { "@Value": value } = await this.api("CheckResult", {
      UserBelongsGroupCheck: { "@SessionID": sessionId, "@GroupID": groupId },
    });
    return normalizeBool(value);
  }

  /**
   * Устанавливает сетевую информацию для текущей сессии.
   *
   * @category Session
   * @param sessionId - Идентификатор сессии.
   * @param params - Параметры NetworkInformationSet.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async networkInformationSet(sessionId: string, params: NetworkInformationSet): Promise<void> {
    await this.api("Done", {
      NetworkInformationSet: {
        "@SessionID": sessionId,
        "@ClientName": params.clientName,
        "@ClientIP": params.clientIP,
        "@ClientUser": params.clientUser,
        "@ModuleName": params.moduleName,
      },
    });
  }

  /**
   * Устанавливает MAC и IP‑адрес клиента для текущей сессии.
   *
   * @category Session
   * @param sessionId - Идентификатор сессии.
   * @param params - Параметры {@link SystemNetAddressSet}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async systemNetAddressSet(sessionId: string, params: SystemNetAddressSet): Promise<void> {
    await this.api("Done", {
      SystemNetAddressSet: {
        "@SessionID": sessionId,
        "@MACAddress": params.MACAddress,
        "@IPAddress": params.IPAddress,
      },
    });
  }

  //====================================================================================================================
  // Информация о системе
  //====================================================================================================================

  /**
   * Возвращает версию протокола API, поддерживаемую сервером.
   *
   * @category System
   * @returns Строка с версией, например `"9.54"`.
   *
   * @example
   * ```typescript
   * const version = await client.protocolInfoGet();
   * console.log("Protocol version: ", version);
   * ```
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async protocolInfoGet(): Promise<string> {
    const { "@Version": version } = await this.api("ProtocolInfo", { ProtocolInfoGet: {} });
    return version;
  }

  /**
   * Возвращает версию базы данных, используемой сервером.
   *
   * @category System
   * @param sessionId - Идентификатор сессии.
   * @returns Строка, например `"12.2.0.1"`.
   *
   * @example
   * ```typescript
   * const version = await client.systemServerVersionGet(sessionId);
   * console.log("Server version: ", version);
   * ```
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async systemServerVersionGet(sessionId: string): Promise<string> {
    const { "@Version": version } = await this.api("ServerInfo", {
      SystemServerVersionGet: { "@SessionID": sessionId },
    });
    return version;
  }

  /**
   * Возвращает подробную информацию о ядре системы.
   *
   * @category System
   * @param sessionId - Идентификатор сессии.
   * @returns Объект {@link CoreInfo}.
   *
   * @example
   * ```typescript
   * const core = await client.systemCoreInfoGet(sessionId);
   * console.log("Core version: ", core.version);
   * ```
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async systemCoreInfoGet(sessionId: string): Promise<CoreInfo> {
    const core = await this.api("CoreInfo", {
      SystemCoreInfoGet: { "@SessionID": sessionId },
    });
    return {
      auditor: core["@Auditor"],
      owner: core["@Owner"],
      version: core["@Version"],
      build: core["@Build"],
      revision: core["@Revision"],
      asVersion: core["@ASVersion"],
      asWarDate: core["@ASWARDate"],
    };
  }

  /**
   * Возвращает информацию о системы.
   *
   * @category System
   * @param sessionId - Идентификатор сессии.
   * @returns Объект {@link SystemContextInfo}.
   *
   * @example
   * ```typescript
   * const system = await client.systemContextInfoGet(sessionId);
   * console.log("System date: ", system.systemDate);
   * ```
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async systemContextInfoGet(sessionId: string): Promise<SystemContextInfo> {
    const system = await this.api("SystemContextInfo", {
      SystemContextInfoGet: { "@SessionID": sessionId },
    });
    return {
      systemDate: system["@SystemDate"],
      systemInfo: system["@SystemInfo"],
      systemName: system["@SystemName"],
    };
  }

  /**
   * Получает все системные настройки в формате ключ значение.
   *
   * @category System
   * @param sessionId - Идентификатор сессии.
   * @returns Массив настроек {@link Setting}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async systemSettingsGet(sessionId: string): Promise<Setting[]> {
    const settings = await this.api("Settings", {
      SystemSettingsGet: { "@SessionID": sessionId },
    });
    return normalizeArray(settings.Setting).map((v) => ({ name: v["@Name"], value: v["@Value"] }));
  }

  /**
   * Получает значение конкретной системной настройки по её имени.
   *
   * @category System
   * @param sessionId - Идентификатор сессии.
   * @param name - Имя настройки (например, "SHOW_SYSTEM_MENU").
   * @returns - Значение или undefined, если настройка не найдена или пуста.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async systemSettingGet(sessionId: string, name: string): Promise<string | undefined> {
    const setting = await this.api("Setting", {
      SystemSettingGet: { "@SessionID": sessionId, "@Name": name },
    });
    return setting["@Value"];
  }

  /**
   * Возвращает относительный URL для эндпоинта авторизации.
   *
   * @category System
   * @returns Строка, например `"/platform2mca/authbasic"`.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async authenticationUrlGet(): Promise<string> {
    const { "@URL": url } = await this.api("AuthenticationURL", { AuthenticationURLGet: {} });
    return url;
  }

  /**
   * Проверяет, разрешено ли использование функционала NOVO для текущей сессии.
   *
   * @category System
   * @param sessionId - Идентификатор сессии.
   * @returns true, если `NOVO` доступен.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async novoAllowedCheck(sessionId: string): Promise<boolean> {
    const { "@Value": val } = await this.api("NovoAllowedCheckResult", {
      NovoAllowedCheck: { "@SessionID": sessionId },
    });
    return normalizeBool(val);
  }

  /**
   * Проверяет, включена ли указанная системная опция.
   *
   * @category System
   * @param sessionId - Идентификатор сессии.
   * @param optionName - Имя опции (например, `"NAV_SKIN_INTERFACE"`).
   * @returns `true`, если опция включена.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async systemOptionEnabledCheck(sessionId: string, optionName: string): Promise<boolean> {
    const result = await this.api("OptionInfo", {
      SystemOptionEnabledCheck: { "@SessionID": sessionId, "@OptionName": optionName },
    });
    return normalizeBool(result["@Enabled"]);
  }

  //====================================================================================================================
  // Отладка
  //====================================================================================================================

  /**
   * Получает текст из отладочного канала по его имени.
   *
   * @category Debug
   * @param sessionId - Идентификатор сессии.
   * @param pipeName - Имя канала.
   * @returns Текст, сгенерированный сервером для этого канала.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async pipeTextGet(sessionId: string, pipeName: string): Promise<string | undefined> {
    const { "@Value": text } = await this.api("PipeText", {
      PipeTextGet: { "@SessionID": sessionId, "@PipeName": pipeName },
    });
    return normalizeString(text);
  }

  /**
   * Получает отладочный текст.
   *
   * @category Debug
   * @param sessionId - Идентификатор сессии.
   * @param direction - Направление отладки.
   * @returns Отладочная информация в виде строки.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async debugTextGet(sessionId: string, direction: string): Promise<string | undefined> {
    const { "@Value": text } = await this.api("DebugText", {
      DebugTextGet: { "@SessionID": sessionId, "@Direction": direction },
    });
    return normalizeString(text);
  }

  //====================================================================================================================
  // ТБП и типы
  //====================================================================================================================

  /**
   * Возвращает короткое имя ТБП и ключ архива для указанного экземпляра.
   *
   * @category Class
   * @param sessionId - Идентификатор сессии.
   * @param objectId - Идентификатор экземпляра.
   * @param baseClassId - Короткое имя базового ТБП (например, `"DOCUMENT"`).
   * @returns Объект {@link ObjectClassAndArchiveKey}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async objectClassAndArchiveKeyGet(
    sessionId: string,
    objectId: number,
    baseClassId: string,
  ): Promise<ObjectClassAndArchiveKey> {
    const res = await this.api("ObjectClassAndArchiveKey", {
      ObjectClassAndArchiveKeyGet: {
        "@SessionID": sessionId,
        "@ObjectID": objectId,
        "@BaseClassID": baseClassId,
      },
    });
    return { classId: res["@ClassID"], archiveKey: res["@ArchiveKey"] };
  }

  /**
   * Возвращает список обратных ссылок на указанный экземпляр.
   *
   * @category Class
   * @param sessionId - Идентификатор сессии.
   * @param objectId - Идентификатор экземпляра.
   * @param classId - Короткое имя ТБП.
   * @returns Массив {@link BackwardReference}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async objectBackwardReferencesGet(
    sessionId: string,
    objectId: number,
    classId: string,
  ): Promise<BackwardReference[]> {
    const refs = await this.api("BackwardReferences", {
      ObjectBackwardReferencesGet: {
        "@SessionID": sessionId,
        "@ObjectID": objectId,
        "@ClassID": classId,
      },
    });
    return normalizeArray(refs.BackwardReference).map((r) => ({
      classId: r["@ClassID"],
      className: r["@ClassName"],
      qual: r["@Qual"],
      qualName: r["@QualName"],
    }));
  }

  /**
   * Возвращает информацию о возможных переходах между состояниями для указанного ТБП.
   *
   * @category Class
   * @param sessionId - Идентификатор сессии.
   * @param classId - Короткое имя ТБП.
   * @returns Массив {@link Transition}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async classTransitionsGet(sessionId: string, classId: string): Promise<Transition[]> {
    const transitions = await this.api("Transitions", {
      ClassTransitionsGet: { "@SessionID": sessionId, "@ClassID": classId },
    });
    return normalizeArray(transitions.Transition).map((v) => ({
      id: v["@ID"],
      name: v["@Name"],
      methodShortName: v["@MethodShortName"],
      initialStateID: v["@InitialStateID"],
      finalStateID: v["@FinalStateID"],
    }));
  }

  /**
   * Возвращает список состояний для указанного ТБП.
   *
   * @category Class
   * @param sessionId - Идентификатор сессии.
   * @param classId - Короткое имя ТБП.
   * @returns Массив {@link State}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async classStatesGet(sessionId: string, classId: string): Promise<State[]> {
    const states = await this.api("States", {
      ClassStatesGet: { "@SessionID": sessionId, "@ClassID": classId },
    });
    return normalizeArray(states.State).map((v) => ({ id: v["@ID"], name: v["@Name"], indexUse: v["@IndexUse"] }));
  }

  /**
   * Проверяет, требуется ли указывать `collectionid` для данного ТБП.
   *
   * @category Class
   * @param sessionId - Идентификатор сессии.
   * @param classId - Короткое имя ТБП.
   * @returns `true`, если `collectionid` обязателен.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async classNeedCollectionIdCheck(sessionId: string, classId: string): Promise<boolean> {
    const { "@Value": isCheck } = await this.api("CheckResult", {
      ClassNeedCollectionIDCheck: { "@SessionID": sessionId, "@ClassID": classId },
    });
    return normalizeBool(isCheck);
  }

  /**
   * Возвращает список дочерних ТБП для указанного ТБП.
   *
   * @category Class
   * @param sessionId - Идентификатор сессии.
   * @param classId - Короткое имя родительского ТБП.
   * @returns Массив {@link ChildClass}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async classChildrenGet(sessionId: string, classId: string): Promise<ChildClass[]> {
    const children = await this.api("ChildClasses", {
      ClassChildrenGet: { "@SessionID": sessionId, "@ClassID": classId },
    });
    return normalizeArray(children.ChildClass).map((v) => ({ id: v["@ID"] }));
  }

  /**
   * Получает детальную информацию о нескольких ТБП/типах.
   *
   * @category Class
   * @param sessionId - Идентификатор сессии.
   * @param classInfo - Массив объектов с полем classId (короткие имена).
   * @returns Массив {@link Class}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async classesGet(sessionId: string, classes: string[]): Promise<Class[]> {
    const res = await this.api("Classes", {
      ClassesGet: {
        "@SessionID": sessionId,
        ClassInfo: classes.map((v) => ({ "@ClassID": v })),
      },
    });
    return normalizeArray(res.Class).map((v) => ({
      id: v["@ID"],
      name: v["@Name"],
      baseClassId: v["@BaseClassID"],
      entityId: v["@EntityID"],
      isKernelType: normalizeBool(v["@IsKernelType"]),
      classInterface: v["@ClassInterface"],
      flags: v["@Flags"],
      menuCaption: v["@MenuCaption"],
      isAccessible: normalizeBoolOrUndefined(v["@IsAccessible"]),
      padLength: v["@PadLength"],
      dataSize: v["@DataSize"],
      dataPrecision: v["@DataPrecision"],
      properties: v["@Properties"],
      groupId: v["@GroupID"],
    }));
  }

  /**
   * Возвращает детальную информацию о конкретном ТБП.
   *
   * @category Class
   * @param sessionId - Идентификатор сессии.
   * @param classId - Короткое имя ТБП.
   * @returns Объект {@link Class} или undefined, если ТБП не найден.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async classGet(sessionId: string, classId: string): Promise<Class | undefined> {
    const v = await this.api(["Class", "NotFound"], {
      ClassGet: { "@SessionID": sessionId, "@ClassID": classId },
    });
    return v === ""
      ? undefined
      : {
          id: v["@ID"],
          name: v["@Name"],
          baseClassId: v["@BaseClassID"],
          entityId: v["@EntityID"],
          isKernelType: normalizeBool(v["@IsKernelType"]),
          classInterface: v["@ClassInterface"],
          flags: v["@Flags"],
          menuCaption: v["@MenuCaption"],
          isAccessible: normalizeBoolOrUndefined(v["@IsAccessible"]),
          padLength: v["@PadLength"],
          dataSize: v["@DataSize"],
          dataPrecision: v["@DataPrecision"],
          properties: v["@Properties"],
          groupId: v["@GroupID"],
        };
  }

  /**
   * Получает список справочников.
   *
   * @category Class
   * @param sessionId - Идентификатор сессии.
   * @returns Массив {@link Class}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async guidesGet(sessionId: string): Promise<Class[]> {
    const guides = await this.api("Guides", {
      GuidesGet: { "@SessionID": sessionId },
    });
    return normalizeArray(guides.Class).map((v) => ({
      id: v["@ID"],
      name: v["@Name"],
      baseClassId: v["@BaseClassID"],
      entityId: v["@EntityID"],
      isKernelType: normalizeBool(v["@IsKernelType"]),
      classInterface: v["@ClassInterface"],
      flags: v["@Flags"],
      menuCaption: v["@MenuCaption"],
      isAccessible: normalizeBoolOrUndefined(v["@IsAccessible"]),
      padLength: v["@PadLength"],
      dataSize: v["@DataSize"],
      dataPrecision: v["@DataPrecision"],
      properties: v["@Properties"],
      groupId: v["@GroupID"],
    }));
  }

  /**
   * Получает список всех типов системы.
   *
   * @category Class
   * @param sessionId - Идентификатор сессии.
   * @returns Массив {@link Class}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async typesGet(sessionId: string): Promise<Class[]> {
    const types = await this.api("Types", {
      TypesGet: { "@SessionID": sessionId },
    });
    return normalizeArray(types.Class).map((v) => ({
      id: v["@ID"],
      name: v["@Name"],
      baseClassId: v["@BaseClassID"],
      entityId: v["@EntityID"],
      isKernelType: normalizeBool(v["@IsKernelType"]),
      classInterface: v["@ClassInterface"],
      flags: v["@Flags"],
      menuCaption: v["@MenuCaption"],
      isAccessible: normalizeBoolOrUndefined(v["@IsAccessible"]),
      padLength: v["@PadLength"],
      dataSize: v["@DataSize"],
      dataPrecision: v["@DataPrecision"],
      properties: v["@Properties"],
      groupId: v["@GroupID"],
    }));
  }

  /**
   * Получает список групп справочников.
   *
   * @category Class
   * @param sessionId - Идентификатор сессии.
   * @returns Массив {@link GuidesGroup}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async guidesGroupsGet(sessionId: string): Promise<GuidesGroup[]> {
    const groups = await this.api("GuidesGroups", {
      GuidesGroupsGet: { "@SessionID": sessionId },
    });
    return normalizeArray(groups.GuidesGroup).map((v) => ({
      id: v["@ID"],
      name: v["@Name"],
    }));
  }

  //====================================================================================================================
  // Операции
  //====================================================================================================================

  /**
   * Возвращает список операций, доступных для указанного ТБП.
   *
   * @category Method
   * @param sessionId - Идентификатор сессии.
   * @param classId - Короткое имя ТБП.
   * @returns Массив {@link Method}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async classMethodsGet(sessionId: string, classId: string): Promise<Method[]> {
    const methods = await this.api("Methods", {
      ClassMethodsGet: { "@SessionID": sessionId, "@ClassID": classId },
    });
    return normalizeArray(methods.Method).map((v) => ({
      id: v["@ID"],
      name: v["@Name"],
      shortName: v["@ShortName"],
      type: v["@Type"],
      formClassId: v["@FormClassID"],
      properties: v["@Properties"],
      distance: v["@Distance"],
      callableShortName: v["@CallableShortName"],
      scriptId: v["@ScriptID"],
      resultClassId: v["@ResultClassID"],
      userDriven: normalizeBoolOrUndefined(v["@UserDriven"]),
      formId: v["@FormID"],
      reportType: v["@ReportType"],
      reportTemplate: v["@ReportTemplate"],
    }));
  }

  /**
   * Получает клиент скрипт для указанной операции.
   *
   * @category Method
   * @param sessionId - Идентификатор сессии.
   * @param methodId - Идентификатор операции.
   * @returns Текст скрипта или `undefined`, если скрипт отсутствует.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async methodClientScriptGet(sessionId: string, methodId: string): Promise<string | undefined> {
    const { "@Text": script } = await this.api("ClientScript", {
      MethodClientScriptGet: { "@SessionID": sessionId, "@MethodID": methodId },
    });
    return normalizeString(script);
  }

  /**
   * Начинает выполнение операции – открывает форму.
   *
   * @category Method
   * @param sessionId - Идентификатор сессии.
   * @param methodId - Идентификатор операции.
   * @returns Идентификатор открытой формы (`frameId`), необходимый для последующих вызовов.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async methodBegin(sessionId: string, methodId: string): Promise<string | undefined> {
    const { "@FrameID": frameId } = await this.api("MethodFrame", {
      MethodBegin: { "@SessionID": sessionId, "@MethodID": methodId },
    });
    return frameId;
  }

  /**
   * Завершает выполнение операции – закрывает форму.
   *
   * @category Method
   * @param sessionId - Идентификатор сессии.
   * @param frameId - Идентификатор формы, полученный из {@link Client.methodBegin}.
   * @returns Идентификатор предыдущей открытой формы (если была) или `undefined`.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async methodEnd(sessionId: string, frameId: string): Promise<string | undefined> {
    const { "@FrameID": prevFrameId } = await this.api("MethodFrame", {
      MethodEnd: { "@SessionID": sessionId, "@FrameID": frameId },
    });
    return prevFrameId;
  }

  /**
   * Получает список входных параметров (P‑параметров) операции.
   *
   * @category Method
   * @param sessionId - Идентификатор сессии.
   * @param methodId - Идентификатор операции.
   * @returns Массив {@link MethodParameter}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async methodParametersGet(sessionId: string, methodId: string): Promise<MethodParameter[]> {
    const params = await this.api("MethodParameters", {
      MethodParametersGet: { "@SessionID": sessionId, "@MethodID": methodId },
    });
    return normalizeArray(params.MethodParameter).map((v) => ({
      shortName: v["@ShortName"],
      classId: v["@ClassID"],
      position: v["@Position"],
      referenceType: v["@ReferenceType"],
      direction: v["@Direction"],
      viewId: v["@ViewID"],
      viewClassId: v["@ViewClassID"],
      viewFilter: v["@ViewFilter"],
      defaultValue: v["@DefaultValue"],
    }));
  }

  /**
   * Получает список публичных переменных (V‑переменных) операции.
   *
   * @category Method
   * @param sessionId - Идентификатор сессии.
   * @param methodId - Идентификатор операции.
   * @returns Массив {@link MethodVariable}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async methodVariablesGet(sessionId: string, methodId: string): Promise<MethodVariable[]> {
    const vars = await this.api("MethodVariables", {
      MethodVariablesGet: { "@SessionID": sessionId, "@MethodID": methodId },
    });
    return normalizeArray(vars.MethodVariable).map((v) => ({
      shortName: v["@ShortName"],
      classId: v["@ClassID"],
      position: v["@Position"],
      referenceType: v["@ReferenceType"],
    }));
  }

  /**
   * Получает список элементов управления (controls) на форме операции.
   *
   * @category Method
   * @param sessionId - Идентификатор сессии.
   * @param formId - Идентификатор операции или `formId` из {@link Method}.
   * @returns Массив {@link Control}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async methodControlsGet(sessionId: string, formId: string): Promise<Control[]> {
    const controls = await this.api("Controls", {
      MethodControlsGet: { "@SessionID": sessionId, "@FormID": formId },
    });
    return normalizeArray(controls.Control).map((v) => ({
      id: v["@ID"],
      methodId: v["@MethodID"],
      qualifier: v["@Qualifier"],
      control: v["@Control"],
      caption: v["@Caption"],
      top: v["@Top"],
      left: v["@Left"],
      height: v["@Height"],
      width: v["@Width"],
      tabIndex: v["@TabIndex"],
      position: v["@Position"],
      validateName: v["@ValidateName"],
      parentId: v["@ParentID"],
      classId: v["@ClassID"],
      depend: v["@Depend"],
      properties: v["@Properties"],
      tips: v["@Tips"],
    }));
  }

  /**
   * Выполняет блок `Validate` операции по умолчанию (при открытии формы).
   *
   * @category Method
   * @param params - Параметры запроса {@link MethodValidateDefault}.
   * @returns Объект {@link Validate}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async methodValidateDefault(sessionId: string, params: MethodValidateDefault): Promise<Validate> {
    const {
      "@DebugText": debugText,
      "@ObjectID": objectId,
      ControlsStates,
    } = await this.api("Validate", {
      MethodValidateDefault: {
        "@SessionID": sessionId,
        "@MethodID": params.methodId,
        "@ClassID": params.classId,
        "@Info": params.info ?? "",
        "@DoCommit": params.doCommit ?? true,
        "@ObjectID": normalizeArray(params.objectId).join(","),
        "@DebugLevel": params.debugLevel ?? 0,
        "@IsCalledFromAnotherMethod": params.isCalledFromAnotherMethod ?? false,
        "@ReadOnly": params.readOnly ?? false,
        "@GetDebugText": params.getDebugText ?? false,
        "@OptimizedGridUpdates": params.optimizedGridUpdates ?? false,
        "@LockObjectClassID": params.lockObjectClassId,
      },
    });
    return {
      debugText,
      objectId,
      controlsStates: normalizeArray(ControlsStates?.ControlState).map((v) => ({ id: v["@ID"], value: v["@Value"] })),
    };
  }

  /**
   * Выполняет блок `Validate` операции по событию элемента формы.
   *
   * @category Method
   * @param params - Параметры запроса {@link MethodValidate}.
   * @returns Объект {@link Validate}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async methodValidate(sessionId: string, params: MethodValidate): Promise<Validate> {
    const {
      "@DebugText": debugText,
      "@ObjectID": objectId,
      ControlsStates,
    } = await this.api("Validate", {
      MethodValidate: {
        "@SessionID": sessionId,
        "@MethodID": params.methodId,
        "@Info": params.info,
        "@Type": params.type ?? "VALIDATE",
        "@DoCommit": params.doCommit ?? true,
        "@GetDebugText": params.getDebugText ?? false,
        "@OptimizedGridUpdates": params.optimizedGridUpdates ?? false,
        ControlsStates: {
          ControlState: normalizeArray(params.controlsStates).map((v) => ({ "@ID": v.id, "@Value": v.value })),
        },
        PLPCallParameters: {
          PLPCallParameter: normalizeArray(params.plpCallParameters).map((e) => ({
            SourcePLPCallItem: e.source.map(buildEntity),
            TargetPLPCallItem: e.target.map(buildEntity),
          })),
        },
      },
    });
    return {
      debugText,
      objectId,
      controlsStates: normalizeArray(ControlsStates?.ControlState).map((v) => ({ id: v["@ID"], value: v["@Value"] })),
    };
  }

  /**
   * Выполняет блок `Execute` операции (непосредственное действие).
   *
   * @category Method
   * @param params - Параметры запроса {@link MethodExecute}.
   * @returns Объект {@link MethodResult}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async methodExecute(sessionId: string, params: MethodExecute): Promise<MethodResult> {
    const { "@Value": value, ControlsStates } = await this.api("Result", {
      MethodExecute: {
        "@SessionID": sessionId,
        "@MethodID": params.methodId,
        "@DoCommit": params.doCommit ?? true,
        "@OptimizedGridUpdates": params.optimizedGridUpdates ?? false,
        ControlsStates: {
          ControlState: normalizeArray(params.controlsStates).map((v) => ({ "@ID": v.id, "@Value": v.value })),
        },
        PLPCallParameters: {
          PLPCallParameter: normalizeArray(params.plpCallParameters).map((e) => ({
            SourcePLPCallItem: e.source.map(buildEntity),
            TargetPLPCallItem: e.target.map(buildEntity),
          })),
        },
      },
    });
    return {
      value,
      controlsStates: normalizeArray(ControlsStates?.ControlState).map((v) => ({ id: v["@ID"], value: v["@Value"] })),
    };
  }

  //====================================================================================================================
  // Представления и данные
  //====================================================================================================================

  /**
   * Возвращает список представлений, доступных для указанного ТБП.
   *
   *
   * @category Method
   * @param sessionId - Идентификатор сессии.
   * @param classId - Короткое имя ТБП.
   * @returns Массив {@link View}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async classViewsGet(sessionId: string, classId: string): Promise<View[]> {
    const views = await this.api("Views", {
      ClassViewsGet: { "@SessionID": sessionId, "@ClassID": classId },
    });
    return normalizeArray(views.View).map((v) => ({
      id: v["@ID"],
      name: v["@Name"],
      shortName: v["@ShortName"],
      isDefault: normalizeBool(v["@IsDefault"]),
      properties: v["@Properties"],
      distance: v["@Distance"],
      objectRights: v["@ObjectRights"],
      toPrinter: normalizeBool(v["@ToPrinter"]),
      toFile: normalizeBool(v["@ToFile"]),
      orderBy: v["@OrderBy"],
      hints: v["@Hints"],
      cellStyleScript: v["@CellStyleScript"],
      sourceId: v["@SourceID"],
      extensionId: v["@ExtensionID"],
      filterMethodShortName: v["@FilterMethodShortName"],
      filterMethodProperties: v["@FilterMethodProperties"],
    }));
  }

  /**
   * Возвращает список колонок для указанного представления.
   *
   * @category Method
   * @param sessionId - Идентификатор сессии.
   * @param viewId - Идентификатор представления.
   * @returns Массив {@link Column}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async viewColumnsGet(sessionId: string, viewId: string): Promise<Column[]> {
    const columns = await this.api("Columns", {
      ViewColumnsGet: { "@SessionID": sessionId, "@ViewID": viewId },
    });
    return normalizeArray(columns.Column).map((v) => ({
      name: v["@Name"],
      width: v["@Width"],
      align: v["@Align"],
      position: v["@Position"],
      qual: v["@Qual"],
      alias: v["@Alias"],
      base: v["@Base"],
      isSizeable: normalizeBool(v["@IsSizeable"]),
      isInvisible: v["@IsInvisible"],
      abilityPerformOperation: normalizeBool(v["@AbilityPerformOperation"]),
      isCellStyle: normalizeBoolOrUndefined(v["@IsCellStyle"]),
      isEditable: normalizeBoolOrUndefined(v["@IsEditable"]),
      referenceId: v["@ReferenceID"],
      targetClassId: v["@TargetClassID"],
      referenceType: v["@ReferenceType"],
      logging: v["@Logging"],
    }));
  }

  /**
   * Получает данные представления (табличные данные).
   *
   * @category Method
   * @param params - Параметры запроса ViewDataGetCancelable.
   * @returns Массив строк {@link RowItem}.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async viewDataGetCancelable(sessionId: string, params: ViewDataGetCancelable): Promise<RowItem[][]> {
    const and = params.userFilter?.and?.map(buildFilter);
    const or = params.userFilter?.or?.map(buildFilter);

    const columns = await this.api("ViewData", {
      ViewDataGetCancelable: {
        "@SessionID": sessionId,
        "@ViewShortName": params.viewShortName,
        "@ClassID": params.classId,
        "@Hint": params.hint ?? "FIRST_ROWS",
        "@AllowTimestampMilliseconds": params.allowTimestampMilliseconds ?? true,
        "@RowsLimit": params.rowsLimit ?? 10,
        AdditionalFilterBind: params.additionalFilterBindClause
          ? { "@Clause": params.additionalFilterBindClause }
          : undefined,
        ObjectFilter: params.objectIdFilter ? { "@ObjectID": params.objectIdFilter } : undefined,
        UserFilter: {
          "@ExtraFilter": params.extraFilter,
          AND: and,
          OR: or,
        },
      },
    });
    return normalizeArray(columns.Row).map((v) =>
      normalizeArray(v.RowItem).map((v) => ({ columnName: v["@ColumnName"], value: v["@Value"] })),
    );
  }

  //====================================================================================================================
  // Блокировки
  //====================================================================================================================

  /**
   * Блокирует один или несколько экземпляров.
   *
   * @category Lock
   * @param sessionId - Идентификатор сессии.
   * @param objects - Массив объектов {@link Object}.
   * @returns Сообщение об ошибке, если блокировка не удалась, иначе `undefined`.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async objectsLock(sessionId: string, objects: Object[]): Promise<string | undefined> {
    const { "@Message": msg } = await this.api("LockResult", {
      ObjectsLock: {
        "@SessionID": sessionId,
        Object: objects.map((obj) => ({ "@ID": obj.id, "@ClassID": obj.classId })),
      },
    });
    return normalizeString(msg);
  }

  /**
   * Разблокирует экземпляры (снять все блокировки или только текущей сессии).
   *
   * @category Lock
   * @param sessionId - Идентификатор сессии.
   * @param clearAllLocks - Если `true`, снимаются все блокировки; если `false` – только текущей сессии.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  public async objectsUnlock(sessionId: string, clearAllLocks: boolean = false): Promise<void> {
    await this.api("Done", {
      ObjectsUnlock: {
        "@SessionID": sessionId,
        "@ClearAllLocks": clearAllLocks,
      },
    });
  }

  //====================================================================================================================
  // Private
  //====================================================================================================================

  private readonly parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@",
    parseTagValue: false,
    parseAttributeValue: false,
  });

  private readonly builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@",
    suppressEmptyNode: true,
    processEntities: false,
    suppressBooleanAttributes: false,
    format: false,
  });

  /**
   * Универсальный метод для выполнения API-запроса.
   *
   * @param expected_key - Ожидаемый корневой тег ответа.
   * @param obj - Тело запроса (объект, который будет сериализован в XML).
   * @returns Объект ответа, соответствующий ключу.
   *
   * @throws {ApiError|HttpError|XmlSerializeError|XmlDeserializeError|UnexpectedResponseError}
   * Возможные ошибки:
   * - {@link ApiError}: Если сессия уже неактивна или невалидна
   * - {@link HttpError}: При сетевых проблемах
   * - {@link XmlSerializeError}: При ошибке сериализации запроса
   * - {@link XmlDeserializeError}: Если ответ не удалось разобрать
   * - {@link UnexpectedResponseError}: Если структура ответа не соответствует ожидаемой
   */
  private async api<K extends Exclude<xml.ResponseKey, "Error">>(
    expectedKey: K | K[],
    obj: xml.RequestBody,
  ): Promise<xml.ResponseValue<K>> {
    const url = this.endpoint("api");
    const xmlBody = this.serialization(obj);

    const { status, statusText, body } = await this.httpAdapter.api(url, xmlBody, {
      "content-type": "text/xml; charset=utf-8",
    });
    if (status < 200 || status >= 300) {
      throw new HttpError(statusText, status, url);
    }

    const root = this.deserialization(body);

    if ("Error" in root) {
      const {
        "@Text": message,
        ServerErrorInfo: { "@Text": details },
      } = root.Error;
      throw new ApiError(message, details);
    }

    const foundKey = normalizeArray(expectedKey).find((k) => k in root);
    if (foundKey) {
      return (root as Record<string, any>)[foundKey] as xml.ResponseValue<K>;
    }

    throw new UnexpectedResponseError(body);
  }

  /**
   * Формирует полный URL для заданного относительного пути.
   *
   * @param path - Относительный путь (например, 'authbasic' или 'api').
   * @returns Полный URL в виде строки.
   */
  private endpoint(path: string): string {
    return new URL(path, this.baseUrl).toString();
  }

  /**
   * Сериализует объект запроса в XML.
   *
   * @param obj - Объект запроса (без обёртки Request).
   * @returns XML-строка с заголовком.
   *
   * @throws {XmlSerializeError}
   * Возможные ошибки:
   * - {@link XmlSerializeError}: При ошибке построения XML
   */
  private serialization(obj: xml.RequestBody): string {
    try {
      return this.builder.build({
        "?xml": {
          "@version": "1.0",
          "@encoding": "UTF-8",
          "@standalone": "yes",
        },
        Request: obj,
      } satisfies xml.Request);
    } catch (cause) {
      throw new XmlSerializeError((cause as Error).message, { cause });
    }
  }

  /**
   * Десериализует XML-ответ в объект.
   *
   * @param text - XML-строка.
   * @returns Корневой объект ответа (содержимое тега <Response>).
   *
   * @throws {XmlDeserializeError}
   * Возможные ошибки:
   *  - {@link XmlDeserializeError} При ошибке парсинга или отсутствии тега <Response>.
   */
  private deserialization(text: string): xml.ResponseBody {
    try {
      const xml = this.parser.parse(text) as xml.Response;
      if (!xml?.Response) {
        throw new Error("Missing <Response> tag");
      }
      return xml.Response;
    } catch (cause) {
      throw new XmlDeserializeError((cause as Error).message, { cause });
    }
  }
}

/**
 * Нормализует значение, которое может быть одним элементом или массивом, в массив.
 *
 * @param value - Значение (один элемент, массив или `undefined`).
 * @returns Массив элементов (пустой, если `value = undefined`).
 */
const normalizeArray = <T>(value: T | T[] | undefined): T[] => {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
};

/**
 * Нормализует значение, которое может быть строкой `"true"` или `"1"`, в `boolean`, или может отсутствовать.
 */
const normalizeBoolOrUndefined = (value: string | undefined): boolean | undefined => {
  if (value === undefined) return undefined;
  return value === "true" || value === "1";
};

/**
 * Нормализует значение, которое может быть строкой `"true"`` или `"1"``, в `boolean`.
 */
const normalizeBool = (value: string | undefined): boolean => {
  if (value === undefined) return false;
  return value === "true" || value === "1";
};

/**
 * Нормализует значение строки, которое может отсутствовать или быть пустым.
 */
const normalizeString = (value: string | undefined): string | undefined => {
  if (value === undefined) return undefined;
  return value.length > 0 ? value : undefined;
};

/**
 * Вспомогательная функция конвертации {@link PLPEntity} в xml
 *
 * @throws {XmlSerializeError}
 * Возможные ошибки:
 * - {@link XmlSerializeError}: При ошибке построения XML
 */
const buildEntity = (e: PLPEntity): xml.PLPEntity => {
  if ("constant" in e) return { PLPConstant: { "@Value": e.constant.value } };
  if ("parameter" in e) return { PLPParameter: { "@MethodID": e.parameter.methodId, "@Name": e.parameter.name } };
  if ("variable" in e) return { PLPVariable: { "@MethodID": e.variable.methodId, "@Name": e.variable.name } };
  throw new XmlSerializeError(`Неизвестный тип PLP: ${JSON.stringify(e)}`);
};

/**
 * Вспомогательная функция конвертации {@link Filter} в xml
 *
 * @throws {XmlSerializeError}
 * Возможные ошибки:
 * - {@link XmlSerializeError}: При ошибке построения XML
 */
const buildFilter = (f: Filter): xml.Filter => {
  if ("simpleFilter" in f)
    return {
      SimpleFilter: {
        "@ColumnName": f.simpleFilter.columnName,
        "@Operator": f.simpleFilter.operator,
        "@Value": f.simpleFilter.value,
      },
    };
  if ("caseInsensitiveFilter" in f)
    return {
      CaseInsensitiveFilter: {
        "@ColumnName": f.caseInsensitiveFilter.columnName,
        "@Operator": f.caseInsensitiveFilter.operator,
        "@Value": f.caseInsensitiveFilter.value,
      },
    };
  if ("and" in f) return { AND: f.and.map(buildFilter) };
  if ("or" in f) return { OR: f.or.map(buildFilter) };
  throw new XmlSerializeError(`Неизвестный тип фильтра: ${JSON.stringify(f)}`);
};
