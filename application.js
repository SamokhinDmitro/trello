class Application{
    constructor(){}

    //Метод позволяет сохранять изменения в DOM-дереве и сохраняет в localStorage
    save(){

        let obj = {
            columns: {
                idCounter: Column.columnCount,
                items: []
            },
            notes: {
                idCounter: Note.noteCount,
                items: []
            }

        };

    //заносим все столбцы в obj

        document.querySelectorAll('.column')

            .forEach((columnElement)=>{
                let column = {
                    id: parseInt(columnElement.getAttribute('data-column-id')),
                    noteIds: []
                };

                //Обход колонок и сохранение id колонки и задачи
                columnElement.querySelectorAll('.note')
                    .forEach(noteElement => {
                        //console.log(parseInt(noteElement.getAttribute('data-note-id')));
                        column.noteIds.push(parseInt(noteElement.getAttribute('data-note-id')));
                    });
                obj.columns.items.push(column);
            });

        //Обход записей в колонках

        document.querySelectorAll('.note')
            .forEach(noteElement => {
                let note = {
                    id: parseInt(noteElement.getAttribute('data-note-id')),
                    content: noteElement.textContent
                } ;

                obj.notes.items.push(note);
            });

        //Cериализация объекта
        let json = JSON.stringify(obj);

        //Помещаем в localStorage
        localStorage.setItem('trello', json);

    }


    //Метод позволяет получить столбцы и заметки из localStorage
    load(){

        //проверка что заданный ключ существует в localStorage
        if(!localStorage.getItem('trello')){
            return;
        }

        const mount = document.querySelector('.columns');
        //Очищаем весь дом от старых столбцов и записей
        mount.innerHTML = '';

        //Десериализация объекта
        const obj = JSON.parse(localStorage.getItem('trello'));

        //Извлекаем индексы элементов из объекта теперь columnCount не будет равнятся 1
        Column.columnCount = obj.columns.idCounter;
        Note.noteCount = obj.notes.idCounter;

        //Поиск записи в массиве записей
        const getNoteById = id => obj.notes.items.find(note => note.id === id);

        for(let {id, noteIds} of obj.columns.items){
            const column = new Column(id);

            //Вставляем элементы в DOM-дерево на странице
            mount.append(column.element);


            for(let noteId of noteIds){
                const {id, content} = getNoteById(noteId);

                const note = new Note(id, content);

                //Выводим записи в колонке
                column.element.querySelector('.notes').append(note.element);
            }

        }

    }


}
