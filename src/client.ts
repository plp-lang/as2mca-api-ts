import { XMLParser } from "fast-xml-parser";
import XMLBuilder from "fast-xml-builder";

import { ApiError, HttpError, UnexpectedResponseError, XmlDeserializeError, XmlSerializeError } from "./error";

import type { HttpAdapter } from "./http-adapter";
import { FetchHttpAdapter } from "./fetch-http-adapter";
import type {
  BackwardReference,
  ChildClass,
  Class,
  CoreInfo,
  NetworkInformationSet,
  ObjectClassAndArchiveKey,
  SessionInfo,
  Setting,
  State,
  SystemNetAddressSet,
  Transition,
  UserInfo,
} from "./models";
import type {
  Response,
  Request,
  RequestBody,
  ResponseBody,
  ResponseKey,
  ResponseValue,
  UserPrivileged,
  UserInfo as UserInfoXML,
} from "./xml";

/**
 * Клиент для взаимодействия с API сервера приложений.
 *
 * Содержит HTTP‑клиент и базовый URL. Все методы выполняют POST‑запросы на эндпоинт `/api`
 * с XML‑телом, соответствующим структурам из модуля `requests`.
 *
 * # Важно
 * - Для работы требуется **активная сессия**, полученная через {@link Client.authbasic} и {@link Client.session_init}.
 */
export class Client {
  private readonly httpAdapter: HttpAdapter;

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
   * Сервер в любом случае устанавливает cookie `JSESSIONID` (даже при неверных учётных данных),
   * поэтому этот метод не возвращает ошибку при неудачной аутентификации.
   * Для проверки успешности следует вызвать {@link session_init}.
   *
   * @param username - Имя пользователя.
   * @param password - Пароль.
   * @throws {HttpError} При сетевых проблемах или если сервер вернул HTTP‑код 4xx/5xx.
   *
   * @remarks
   * После вызова этого метода сервер установит `JSESSIONID` в cookie клиента.
   * Для активации сессии необходимо вызвать {@link session_init}.
   *
   * @example
   * ```typescript
   * await client.authbasic('admin', 'password');
   * ```
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
   * После успешного вызова возвращается структура {@link SessionInfo}, содержащая `session_id`
   * и имя отладочного канала (`debug_pipe_name`).
   *
   * @param aliveActiveSession - Флаг, указывающий, следует ли поддерживать активную сессию (опционально).
   *
   * @returns Данные сессии {@link SessionInfo}.
   *
   * @throws {ApiError} Если сервер вернул ошибку (неверные логин/пароль, блокировка и т.п.).
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
   *
   * @example
   * ```typescript
   * const session = await client.sessionInit();
   * console.log('Session ID: ', session.sessionId);
   * ```
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
   * После вызова все последующие запросы с этим `session_id` будут отклонены.
   *
   * @param sessionId - Идентификатор сессии, полученный из {@link SessionInfo.session_id}.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
   *
   * @example
   * ```typescript
   * await client.sessionDeinit(session.sessionId);
   * ```
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
   * @param sessionId - Идентификатор сессии.
   *
   * @returns true, если пользователь имеет привилегии.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
   */
  public async systemUserPrivilegedGet(sessionId: string): Promise<boolean> {
    const user = await this.api("User", {
      SystemUserPrivilegedGet: { "@SessionID": sessionId },
    });
    const isPrivileged = (user as UserPrivileged)["@IsPrivileged"];
    return normalizeBool(isPrivileged);
  }

  /**
   * Возвращает детальную информацию о пользователе.
   *
   * @param sessionId - Идентификатор сессии.
   *
   * @returns Объект {@link UserInfo}.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
   */
  public async userInfoGet(sessionId: string): Promise<UserInfo> {
    const user = (await this.api("User", {
      UserInfoGet: { "@SessionID": sessionId },
    })) as UserInfoXML;
    return {
      name: user["@Name"],
      shortName: user["@ShortName"],
      properties: user["@Properties"],
    };
  }

  /**
   * Получает значение свойства профиля пользователя по его имени.
   *
   * @param sessionId - Идентификатор сессии.
   * @param propertyName - Имя свойства (например, "SESSIONS_PER_USER").
   *
   * @returns Значение свойства в виде строки.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
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
   * @param sessionId - Идентификатор сессии.
   * @param groupId - Идентификатор группы (например, "ADMIN_GRP").
   *
   * @returns true, если пользователь является членом группы.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
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
   * @param sessionId - Идентификатор сессии.
   * @param params - Параметры NetworkInformationSet.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
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
   * @param sessionId - Идентификатор сессии.
   * @param params - Параметры {@link SystemNetAddressSet}.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
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

  /**
   * Возвращает информацию о возможных переходах между состояниями для указанного ТБП.
   * 
   * @param sessionId - Идентификатор сессии.
   * @param classId - Короткое имя ТБП.
   * 
   * @returns Массив {@link Transition}.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
   */
  public async classTransitionsGet(sessionId: string, classId: string): Promise<Transition[]> {
    const transitions = await this.api('Transitions', {
      ClassTransitionsGet: { '@SessionID': sessionId, '@ClassID': classId },
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
   * @param sessionId - Идентификатор сессии.
   * @param classId - Короткое имя ТБП.
   * 
   * @returns Массив {@link State}.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
   */
  public async classStatesGet(sessionId: string, classId: string): Promise<State[]> {
    const states = await this.api('States', {
      ClassStatesGet: { '@SessionID': sessionId, '@ClassID': classId },
    });
    return normalizeArray(states.State).map((v) => ({ id: v["@ID"], name: v["@Name"], indexUse: v["@IndexUse"] }));
  }

  /**
   * Проверяет, требуется ли указывать `collectionid` для данного ТБП.
   * 
   * @param sessionId - Идентификатор сессии.
   * @param classId - Короткое имя ТБП.
   * 
   * @returns true, если `collectionid` обязателен.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
   */
  public async classNeedCollectionIdCheck(sessionId: string, classId: string): Promise<boolean> {
    const { "@Value": isCheck } = await this.api('CheckResult', {
      ClassNeedCollectionIDCheck: { '@SessionID': sessionId, '@ClassID': classId },
    });
    return normalizeBool(isCheck);
  }

  /**
   * Возвращает список дочерних ТБП для указанного ТБП.
   * 
   * @param sessionId - Идентификатор сессии.
   * @param classId - Короткое имя родительского ТБП.
   * 
   * @returns Массив {@link ChildClass}.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
   */
  public async classChildrenGet(sessionId: string, classId: string): Promise<ChildClass[]> {
    const children = await this.api('ChildClasses', {
      ClassChildrenGet: { '@SessionID': sessionId, '@ClassID': classId },
    });
    return normalizeArray(children.ChildClass).map((v) => ({ id: v["@ID"] }));
  }

  /**
   * Получает детальную информацию о нескольких ТБП/типах.
   * 
   * @param sessionId - Идентификатор сессии.
   * @param classInfo - Массив объектов с полем classId (короткие имена).
   * 
   * @returns Массив {@link Class}.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
   */
  public async classesGet(sessionId: string, classes: string[]): Promise<Class[]> {
    const res = await this.api('Classes', {
      ClassesGet: {
        '@SessionID': sessionId,
        ClassInfo: classes.map(v => ({ '@ClassID': v })),
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
      isAccessible: normalizeBool(v["@IsAccessible"]),
      padLength: v["@PadLength"],
      dataSize: v["@DataSize"],
      dataPrecision: v["@DataPrecision"],
      properties: v["@Properties"],
      groupId: v["@GroupID"],
    }));
  }


  //====================================================================================================================
  // Информация о системе
  //====================================================================================================================

  /**
   * Возвращает версию протокола API, поддерживаемую сервером.
   *
   * @returns Строка с версией, например "9.54".
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
   *
   * @example
   * ```typescript
   * const version = await client.protocolInfoGet();
   * console.log("Protocol version: ", version);
   * ```
   */
  public async protocolInfoGet(): Promise<string> {
    const { "@Version": version } = await this.api("ProtocolInfo", { ProtocolInfoGet: {} });
    return version;
  }

  /**
   * Возвращает версию базы данных, используемой сервером.
   *
   * @param sessionId - Идентификатор сессии.
   *
   * @returns Строка, например "12.2.0.1".
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
   *
   * @example
   * ```typescript
   * const version = await client.systemServerVersionGet(sessionId);
   * console.log("Server version: ", version);
   * ```
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
   * @param sessionId - Идентификатор сессии.
   *
   * @returns Объект {@link CoreInfo}.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
   *
   * @example
   * ```typescript
   * const core = await client.systemCoreInfoGet(sessionId);
   * console.log("Core version: ", core.version);
   * ```
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
   * Получает все системные настройки в формате ключ значение.
   *
   * @param sessionId - Идентификатор сессии.
   *
   * @returns Массив настроек {@link Setting}.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
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
   * @param sessionId - Идентификатор сессии.
   * @param name - Имя настройки (например, "SHOW_SYSTEM_MENU").
   *
   * @returns - Значение или undefined, если настройка не найдена или пуста.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
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
   * @returns Строка, например "/platform2mca/authbasic".
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
   */
  public async authenticationUrlGet(): Promise<string> {
    const { "@URL": url } = await this.api("AuthenticationURL", { AuthenticationURLGet: {} });
    return url;
  }

  /**
   * Проверяет, разрешено ли использование функционала NOVO для текущей сессии.
   *
   * @param sessionId - Идентификатор сессии.
   *
   * @returns true, если NOVO доступен.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
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
   * @param sessionId - Идентификатор сессии.
   * @param optionName - Имя опции (например, "NAV_SKIN_INTERFACE").
   *
   * @returns true, если опция включена.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
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
   * @param sessionId - Идентификатор сессии.
   * @param pipeName - Имя канала.
   *
   * @returns Текст, сгенерированный сервером для этого канала.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
   */
  public async pipeTextGet(sessionId: string, pipeName: string): Promise<string> {
    const result = await this.api("PipeText", {
      PipeTextGet: { "@SessionID": sessionId, "@PipeName": pipeName },
    });
    return result["@Value"];
  }

  /**
   * Получает отладочный текст.
   *
   * @param sessionId - Идентификатор сессии.
   * @param direction - Направление отладки.
   *
   * @returns Отладочная информация в виде строки.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
   */
  public async debugTextGet(sessionId: string, direction: string): Promise<string> {
    const result = await this.api("DebugText", {
      DebugTextGet: { "@SessionID": sessionId, "@Direction": direction },
    });
    return result["@Value"];
  }

  //====================================================================================================================
  // ТБП и типы
  //====================================================================================================================

  /**
   * Возвращает короткое имя ТБП и ключ архива для указанного экземпляра.
   *
   * @param sessionId - Идентификатор сессии.
   * @param objectId - Идентификатор экземпляра.
   * @param baseClassId - Короткое имя базового ТБП (например, "DOCUMENT").
   *
   * @returns Объект {@link ObjectClassAndArchiveKey}.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
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
   * @param sessionId - Идентификатор сессии.
   * @param objectId - Идентификатор экземпляра.
   * @param classId - Короткое имя ТБП.
   *
   * @returns Массив {@link BackwardReference}.
   *
   * @throws {ApiError} Если сессия уже неактивна или невалидна.
   * @throws {HttpError} При сетевых проблемах.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} Если ответ не удалось разобрать.
   * @throws {UnexpectedResponseError} Если структура ответа не соответствует ожидаемой.
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

  //====================================================================================================================
  // Private
  //====================================================================================================================

  private readonly parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@",
    parseTagValue: true,
    parseAttributeValue: false,
  });

  private readonly builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@",
    suppressEmptyNode: true,
    format: false,
  });

  /**
   * Универсальный метод для выполнения API-запроса.
   *
   * @param expected_key - Ожидаемый корневой тег ответа.
   * @param obj - Тело запроса (объект, который будет сериализован в XML).
   *
   * @returns Распарсенный объект ответа, соответствующий ключу.
   *
   * @throws {HttpError} При сетевых проблемах.
   * @throws {ApiError} Если сервер вернул ошибку в XML.
   * @throws {UnexpectedResponseError} Если ожидаемый ключ отсутствует в ответе.
   * @throws {XmlSerializeError} При ошибке сериализации запроса.
   * @throws {XmlDeserializeError} При ошибке парсинга ответа.
   */
  private async api<K extends Exclude<ResponseKey, "Error">>(
    expectedKey: K,
    obj: RequestBody,
  ): Promise<ResponseValue<K>> {
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

    if (expectedKey in root) {
      return (root as Record<K, any>)[expectedKey] as ResponseValue<K>;
    }

    throw new UnexpectedResponseError(body);
  }

  /**
   * Формирует полный URL для заданного относительного пути.
   *
   * @param path - Относительный путь (например, 'authbasic' или 'api').
   *
   * @returns Полный URL в виде строки.
   */
  private endpoint(path: string): string {
    return new URL(path, this.baseUrl).toString();
  }

  /**
   * Сериализует объект запроса в XML.
   *
   * @param obj - Объект запроса (без обёртки Request).
   *
   * @returns XML-строка с заголовком.
   *
   * @throws {XmlSerializeError} При ошибке построения XML.
   */
  private serialization(obj: RequestBody): string {
    try {
      return this.builder.build({
        "?xml": {
          "@version": "1.0",
          "@encoding": "UTF-8",
          "@standalone": "yes",
        },
        Request: obj,
      } satisfies Request);
    } catch (cause) {
      throw new XmlSerializeError((cause as Error).message, { cause });
    }
  }

  /**
   * Десериализует XML-ответ в объект.
   *
   * @param text - XML-строка.
   *
   * @returns Корневой объект ответа (содержимое тега <Response>).
   *
   * @throws {XmlDeserializeError} При ошибке парсинга или отсутствии тега <Response>.
   */
  private deserialization(text: string): ResponseBody {
    try {
      const xml = this.parser.parse(text) as Response;
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
 * @param value - Значение (один элемент, массив или undefined).
 *
 * @returns Массив элементов (пустой, если value = undefined).
 */
const normalizeArray = <T>(value: T | T[] | undefined): T[] => {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
};

/**
 * Нормализует значение, которое может быть строкой "true" или "1", в boolean.
 */
const normalizeBool = (value: string | undefined): boolean => {
  if (value === undefined) return false;
  return value === "true" || value === "1"
};