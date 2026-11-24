# История изменений

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/)

## [0.4.0] - 2026-11-24

### Добавлено

- Опциональный параметр `orderBy` для сортировки результатов `viewDataGetCancelable` [@Falldot].
- Конструктор `Client` принимает `xmlParserOptions` и `xmlBuilderOptions`. Настройки по умолчанию доступны как `XMLParserDefaultOptions` и `XMLBuilderDefaultOptions` ([#2](https://github.com/plp-lang/as2mca-api-ts/issues/2)) [@Falldot].

### Изменено

- `HttpError.message` и `ApiError.message` теперь содержат исходное сообщение без служебного префикса. Код и URL HTTP-ошибки, а также подробности ошибки API по-прежнему доступны в отдельных полях [@Falldot].
- Расширен список версий модулей, с которыми тестировалась библиотека [@Falldot].
- Обновлены зависимости. Сборка теперь использует `bun check` для проверки типов и `bun fmt` для форматирования [@Falldot].

### Исправлено

- При формировании XML-запросов теперь по умолчанию экранируются метасимволы, в том числе `&`, `'`, `<` и `>`. Раньше строки с этими символами могли вызвать ошибку на стороне СП ([#2](https://github.com/plp-lang/as2mca-api-ts/issues/2)) [@Falldot].

## [0.3.0] - 2026-08-10

### Добавлено

- Новые методы API:
  `systemInfoGet`, `systemLimitGet`, `systemContextGet`, `systemApplicationNameGet`, `systemHelpSystemInfoGet`
  `embeddedInteractionAvailableCheck`, `embeddedInteractionRequiredCheck`, `embeddedInteractionGetResource`
  `contextInformationAvailableCheck`, `embeddedInteractionPost`, `embeddedInteractionGet` [@Falldot].

### Изменено

- Расширены варианты значений для типов `Invisible` и `Logging` [@Falldot].
- Функция нормализации `boolean` теперь регистронезависима [@Falldot].
- Поле `parentId` в типе `Control` теперь нормализуется как `undefined` при получении пустой строки от сервера [@Falldot].

## [0.2.1] - 2026-08-05

### Исправлено

- Исправил ошибку сериализации поля `controlsStates` для методов `methodValidateDefault`, `methodValidate` и `methodExecute` [@Falldot].

## [0.2.0] - 2026-08-03

### Добавлено

- Метод API `systemContextInfoGet` [@Falldot].

### Изменено

- Для параметра `rowLimits` метода `viewDataGetCancelable` установлено значение по умолчанию `10` [@Falldot].
- Расширен список версий модулей, с которыми тестировалась библиотека [@Falldot].
