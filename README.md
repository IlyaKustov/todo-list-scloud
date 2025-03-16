# ToDo List Scloud

Тестовое задание в команду мобильной разработки Scloud


## Использованные библиотеки

* `@angular` 19.2.0
*  Для хранения данных в бд `IndexedDB` использован `ngx-indexed-db`
* В качестве решения для управления состоянием `signalStore` из `@ngrx/store` 
* Дополнительно реализован перевод с использованием `@ngx-translate`
* Библиотеки `bootstrap` и `ngx-bootstrap` для интерфейса
* Библиотека `ngx-drag-drop` для реализации drag&drop

### Запуск

```bash
ng start
```

## Тестирование
Реализованы следующие тесты
* На реализованный `signalStore` **ToDoStore** 
* На сервис получения данных из `IndexedDB` **DbService**
* На компонент `TodoCurrentCountsComponent`

### Запуск тестов

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

