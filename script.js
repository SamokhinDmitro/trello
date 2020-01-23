/*
Приложение - аналог Trello
В приложении реализованы следующие действия

1. Добавление 1 задачи
2. Добавление 1 столбца
3. Редактирование задачи и заголовков столбца (двойной клик)
4. Автоматическое удаление пустой задачи
5. Перетаскивание задач между столбцами
6. Перетаскивание колонок
7. Сохранение данных в LocalStorage
8. Извлечение данных из LocalStorage
9. ООП-реализация (ES6)
*/


let app = new Application;
//Загрузка контента из localStorage
app.load();

//Добавление новой колонки
document.querySelector('[data-action-addColumn]')
    .addEventListener('click', function(){
        let columnElement = new Column;
        document.querySelector('.columns').appendChild(columnElement.element);
        //Сохранение данных в localStorage
       app.save();
    });







