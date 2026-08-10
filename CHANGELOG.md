# История изменений

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/)

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
