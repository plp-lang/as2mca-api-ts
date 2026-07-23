# HTTP-клиент сервера приложений 2 MCA АБС ЦФТ

<h4 align="center">
  <a href="https://www.npmjs.com/package/as2mca-api">
      <img src="https://img.shields.io/badge/npm-v0.1.0-red?logo=npm" alt="npm" />
  </a>
  <a href="https://github.com/plp-lang/as2mca-api-ts">
      <img src="https://img.shields.io/badge/GitHub-repo-3178C6?logo=typescript" alt="TypeScript Source" />
  </a>
  <a href="https://crates.io/crates/as2mca-api">
    <img src="https://img.shields.io/badge/crates.io-v0.1.0-orange?logo=hack-the-box&logoColor=ea7233" alt="Rust Crate" />
  </a>
  <a href="https://github.com/plp-lang/as2mca-api-rs">
    <img src="https://img.shields.io/badge/GitHub-repo-dea584?logo=rust" alt="Rust Source" />
  </a>
  <a href="https://github.com/plp-lang/as2mca-api-rs/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license" />
  </a>
</h4>

Неофициальная, свободная асинхронная Typescript-библиотека, предоставляющая типизированный клиент для взаимодействия с API сервера приложений Платформы 2 MCA АБС ЦФТ в том числе для режима эмуляции Платформы 1.
Библиотека позволяет обращаться к серверу приложений аналогично клиенту «ЦФТ - Навигатор», программно реализуя схожее поведение: от управления сессиями и аутентификации до работы с выборками представлений и вызова операций.

Проект создан исключительно в некоммерческих, образовательных и исследовательских целях. Основные направления применения:

- **Изучение API** сервера приложений Платформы 2 MCA (понимание протокола, форматов XML и жизненного цикла сессий);
- **Интеграционное и автоматизированное тестирование** бизнес-логики, результатов выборок представлений и исполнения операций в АБС;
- **Интеграция со сторонними сервисами** (разработка бэкендов, микросервисов, шлюзов и скриптов автоматизации);
- **Разработка альтернативных клиентских приложений** (создание собственных GUI-интерфейсов, веб-клиентов или мобильных приложений) для работы с банковской системой.

> [!WARNING]
> Данный проект является **неофициальным** и **не аффилирован** с компанией «ЦФТ» или разработчиками Платформы 2 MCA.
> Библиотека создана на основе самостоятельного анализа поведения клиента «ЦФТ - Навигатор» и открытых сетевых обменов.
>
> Проект не гарантирует _полную_ совместимость с сервером приложений. В зависимости от:
>
> - Версии протокола обмена,
> - Конфигурации сервера, установленных патчей и обновлений ТЯ,
> - Политик безопасности и сетевых настроек конкретного контура.
>
> Структура запросов/ответов API и жизненный цикл сессий могут отличаться.
>
> Использование этого проекта в продуктовых контурах банков или в нарушение лицензионных соглашений и политик безопасности «ЦФТ» осуществляется исключительно на ваш страх и риск.
> Автор не несет ответственности за любые прямые или косвенные последствия использования этой библиотеки.

## Полезные ссылки

- Библиотека на [npmjs.com](https://www.npmjs.com/package/as2mca-api)
- Альтернативная реализация на **Rust**: [crates.io](https://crates.io/crates/as2mca-api) | [source](https://github.com/plp-lang/as2mca-api-rs)

## Основные возможности

- **Управление сессией**: Basic‑аутентификация, активация/деактивация сессии;
- **Системная информация**: версия протокола, версия БД, настройки системы;
- **Информация о пользователе**: параметры, группы, привилегии;
- **Работа с ТБП и типами**: получение списка справочников, типов и переходов состояний;
- **Операции**: открытие формы, получение параметров, переменных, элементов формы, вызов блоков `Validate` и `Execute`;
- **Представления**: получение данных, колонок, списка представлений для ТБП;
- **Блокировки**: блокировка/разблокировка экземпляров.

Все запросы и ответы типизированы, используют [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) и [fast-xml-builder](https://github.com/NaturalIntelligence/fast-xml-builder) для работы с XML.

## Совместимость

Библиотека тестировалась с следующими версиями:

- **Protocol** (`protocolInfoGet`): `9.54`;
- **ТЯ**: `7.6.5.0`;
- **АБС**: `26.2.12`;
- **СП**: `3.11.128 (2 MCA DBI Oracle 12.2.0.1.0)`;
- **Java-компилятор**: `7.9.16`;

Если ваш сервер использует другие версии, некоторые структуры могут не совпадать.
В таком случае прошу открыть Issue или Pull Request.

## Пример использования

Установка:

```sh
npm install as2mca-api
```

### Пример 1

Получение данных из представления `::[USER].[VW_CRIT_USER]`:

```ts
import { Client } from "as2mca-api";

const client = new Client(URL);

// Авторизация и инициализация сессии
await client.authbasic(USERNAME, PASSWORD);
const { sessionId } = await client.sessionInit();

// Получаем 5 первых строк представления `::[USER].[VW_CRIT_USER]`
const rows = await client.viewDataGetCancelable(sessionId, {
  viewShortName: "VW_CRIT_USER",
  classId: "USER",
  rowsLimit: 5,
});

// Печатаем данные в консоль
for (const row of rows) {
  for (const column of row) {
    console.log(column.columnName, " = ", column.value);
  }
  console.log("---");
}

// Завершаем сессию
await client.sessionDeinit(sessionId);
```

### Пример 2

Добавить свою настройку в `::[FP_TUNE]`, через операцию `::[FP_TUNE].[NEW#AUTO]`

Авторизация и инициализация сессии:

```ts
import { Client } from "as2mca-api";

const client = new Client(URL);

await client.authbasic(USERNAME, PASSWORD);
const { sessionId } = await client.sessionInit();
```

Получаем список всех операций ТБП `::[FP_TUNE]` и находим `ID` операции `[NEW#AUTO]` для последующих запросов:

```ts
const classShortName = "FP_TUNE";
const methodShortName = "NEW#AUTO";

const methods = await client.classMethodsGet(sessionId, classShortName);
const methodId = methods.find((v) => v.shortName === methodShortName)?.id;
if (!methodId) throw Error(`"Операция ${methodShortName} не найдена!"`);
```

Открываем форму и получаем `frameId`, который понадобится для закрытия формы:

```ts
const frameId = await client.methodBegin(sessionId, methodId);
if (!frameId) throw Error(`Не удалось открыть операцию ${methodShortName}`);
```

Опционально вызываем блок `VALIDATE` по умолчанию, `P_MESSAGE = 'DEFAULT'`:

```ts
await client.methodValidateDefault(sessionId, {
  classId: classShortName,
  methodId,
});
```

#### Дальше у нас несколько варантов исполнения операции

**Вариант 1**: поочередно заполнять элементы формы и вызывать блок `VALIDATE` как событие `P_MESSAGE = 'VALIDATE'` с соответствующим `P_INFO`:

```ts
// Заполняем элемент формы "Группа"
await client.methodValidate(sessionId, {
  methodId,
  info: "%PARAM%.P_GROUP_ID",
  controlsStates: [{ id: "17007839", value: "AS2MCA_TEST_GROUP" }],
});

// Заполняем элемент формы "Наименование"
await client.methodValidate(sessionId, {
  methodId,
  info: "%PARAM%.P_NAME",
  controlsStates: [{ id: "17007820", value: "Тестовая настройка" }],
});

// Заполняем элемент формы "Код"
await client.methodValidate(sessionId, {
  methodId,
  info: "%PARAM%.P_CODE",
  controlsStates: [{ id: "17007818", value: "AS2MCA_TEST_CODE" }],
});

// Выбираем тип значения как "Логика"
await client.methodValidate(sessionId, {
  methodId,
  info: "%VAR%.V_VAL_TYPE.0",
  controlsStates: [{ id: "17007844", value: "4" }],
});

// Уставливаем значение настройки
await client.methodValidate(sessionId, {
  methodId,
  info: "%VAR%.V_VAL_BOOL.0",
  controlsStates: [{ id: "17007835", value: "1" }],
});

// Выполняем операцию, нажатие на кнопку "ОК"
const { value: objectId } = await client.methodExecute(sessionId, { methodId });
console.log("Была успешно добавлена новая настройка в `::[FP_TUNE]` с `ID` = ", objectId);
```

**Вариант 2**: вызвать блок `EXECUTE` операции, с заранее заполненными элементами формы:

```ts
// Выполняем операцию, нажатие на кнопку "ОК"
const { value: objectId } = await client.methodExecute(sessionId, {
  methodId,
  controlsStates: [
    { id: "17007839", value: "AS2MCA_TEST_GROUP" },
    { id: "17007820", value: "Тестовая настройка" },
    { id: "17007818", value: "AS2MCA_TEST_CODE" },
    { id: "17007864", value: "BOOLEAN" },
    { id: "17007835", value: "1" },
  ],
});
console.log("Была успешно добавлена новая настройка в `::[FP_TUNE]` с `ID` = ", objectId);
```

**Вариант 3**: вызвать блок `VALIDATE` с параметрами, как `PLPCALL`

Аналогично команде: `<%PLPCALL [FP_TUNE].[TEST2](%PARAM%.P_CODE => 'AS2MCA_TEST_CODE', %PARAM%.P_NAME => 'Тестовая настройка'", и т.д...) %>`

```ts
await client.methodValidate(sessionId, {
  methodId,
  info: "%PLPCALL%",
  plpCallParameters: [
    {
      target: [{ parameter: { methodId, name: "P_GROUP_ID" } }],
      source: [{ constant: { value: "AS2MCA_TEST_GROUP" } }],
    },
    {
      target: [{ parameter: { methodId, name: "P_NAME" } }],
      source: [{ constant: { value: "Тестовая настройка" } }],
    },
    {
      target: [{ parameter: { methodId, name: "P_CODE" } }],
      source: [{ constant: { value: "AS2MCA_TEST_CODE" } }],
    },
    {
      target: [{ parameter: { methodId, name: "P_VAL_TYPE" } }],
      source: [{ constant: { value: "BOOLEAN" } }],
    },
    {
      target: [{ parameter: { methodId, name: "P_VALUES" } }],
      source: [{ constant: { value: "45543423508" } }],
    },
  ],
});

// Выполняем операцию, нажатие на кнопку "ОК"
const { value: objectId } = await client.methodExecute(sessionId, { methodId });
console.log("Была успешно добавлена новая настройка в `::[FP_TUNE]` с `ID` = ", objectId);
```

Закрываем форму операции, передав `frameId`, полученный из метода `methodBegin`:

```ts
await client.methodEnd(sessionId, frameId);
```

Не забываем закрыть сессию:

```ts
await client.sessionDeinit(sessionId);
```

> Больше примеров можно посмотреть в [examples](https://github.com/plp-lang/as2mca-api-ts/tree/main/examples) или в [tests](https://github.com/plp-lang/as2mca-api-ts/tree/main/tests).

## Лицензия

[MIT](https://github.com/plp-lang/as2mca-api-ts/blob/master/LICENSE)
