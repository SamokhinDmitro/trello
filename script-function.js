/*
1. Добавление 1 задачи +
2. Добавление 1 столбца +
3. Редактирование задачи и заголовка +
4. Перетаскивание задачи
5. Перетаскивание всей панели-(столбца)
6. Сохранение данных в LocalStorage
7. Извлечение данных из LocalStorage
8. Перевести все на классы
*/

//Начальное количество заметок и колонок на странице

let columnCount = 1;
let noteCount = 1;


let draggedElem = null; //перетаскиваемая заметка
let draggedColumn = null;//перетаскиваемая колонка
let droppedColumn = null;//отслеживаем drop на элементе

//Загрузка контента из localStorage
load();

//Добавление новой колонки
document.querySelector('[data-action-addColumn]')
    .addEventListener('click', function(){
        let columnElement = createColumnElement();
        document.querySelector('.columns').appendChild(columnElement);
        save();
    });

//Действие над элементами колонки
function columnProcess(columnElement){
    //Добавление записки - note
    let addNote = columnElement.querySelector('[data-action-addNote]');
    addNote.addEventListener('click', function(){
        let note = createNoteElement();
        columnElement.querySelector('.notes').appendChild(note);

        //Сразу заполнение новой задачи
        note.setAttribute('contenteditable', 'true');
        note.focus();
    });

    //Редактирование заголовков в колонке
    let columnHeader = columnElement.querySelector('.column-header');
    editNote(columnHeader);

    //Перетаскивание задачи в пустую колонку
    columnElement.addEventListener('dragover', function(event){
        event.preventDefault();
    });


    columnElement.addEventListener('drop', function(){
        if(draggedElem){

            return columnElement.querySelector('.notes').append(draggedElem);
        }
    });

    //Перетаскивание колонок
    //Начало перетаскивания колонки
    columnElement.addEventListener('dragstart', dragstart_Column);
    //Конец претаскивания колонки
    columnElement.addEventListener('dragend', dragend_Column);

    columnElement.addEventListener('dragover', dragover_Column);
    columnElement.addEventListener('drop', drop_Column);
}

//Создание заметки
function createNoteElement(id = null, content = ''){
    let note = document.createElement('div');
    note.classList.add('note');
    note.setAttribute('draggable', 'true');
    note.textContent = content;
    if(id){
     note.setAttribute('data-note-id', id);
    }else{
    note.setAttribute('data-note-id', ++noteCount);

     }

    //Редактирование задач
    editNote(note);
    return note;
}

//Создание колонки
function createColumnElement(id = null){

    let columnElement = document.createElement('div');
    columnElement.classList.add('column');
    columnElement.setAttribute('draggable', 'true');

    if(id){
        columnElement.setAttribute('data-column-id', id);
    }else{
        columnElement.setAttribute('data-column-id', ++columnCount);


    }

    columnElement.innerHTML = `
        <p class="column-header">В плане</p>
					<div class="notes"></div>
					<p class="column-footer">
						<span data-action-addNote class="action">+ Добавить карточку</span>
					</p>
        
        `;
    columnProcess(columnElement);

    return columnElement;
}

//Действия DragAndDrop над колонками

//dragstart-Column
function dragstart_Column(event){
    //event.stopPropagation();
    draggedColumn = this;
    this.classList.add('dragged');
    //console.log('dragstart-Column');

    //всем записям в колонке удаляем атрибут переноса
    document.querySelectorAll('.note')
        .forEach((notElement) => {notElement.removeAttribute('draggable')});
}

//dragend_Column

function dragend_Column(){
    draggedColumn = null;
    droppedColumn = null;

    //убираем класс у активной колонки при перетаскивании
    this.classList.remove('dragged');
    //console.log('dragend_Column');

    //Убираем затемнение у всех колонок
    document.querySelectorAll('.column')
        .forEach(function(el){
            el.classList.remove('under');
        });

    //всем записям в колонке добавляем атрибут переноса
    document.querySelectorAll('.note')
        .forEach((notElement) => {notElement.setAttribute('draggable', 'true')});
    save();
}


//dragover-Column
function dragover_Column(event){

    event.preventDefault();

    if(draggedColumn === this){
        if(droppedColumn){
            droppedColumn.classList.remove('under');
        }
        droppedColumn = null;
    }

    if(!draggedColumn || draggedColumn === this){
        return;
    }
    droppedColumn = this;
    //Убираем затемнение у всех колонок
    document.querySelectorAll('.column')
        .forEach(function(columnElement){
           columnElement.classList.remove('under');
        });

    this.classList.add('under');
    //console.log(this);

}


//drop-Column
function drop_Column(event){
    if(draggedElem){
        this.querySelector('.notes').append(draggedElem);
    }else if(draggedColumn){
        //console.log('drop_Column');

        const children = Array.from(document.querySelector('.columns').children);
        const indexA = children.indexOf(this);
        const indexB = children.indexOf(draggedColumn);
        //сравнивания индексов колонок и меняем местами
        //console.log(indexA, indexB);
        if(indexA < indexB){
            document.querySelector('.columns').insertBefore(draggedColumn, this);
        }else{
            document.querySelector('.columns').insertBefore(draggedColumn, this.nextElementSibling);
        }
    }

    //Убираем затемнение у всех колонок
    document.querySelectorAll('.column')
        .forEach(function(columnElement){
            columnElement.classList.remove('under');
        });
}


//Действия над записками-note
//Редактирование заметок и записей
function editNote(noteElement){
    //начало редактирования записи
    noteElement.addEventListener('dblclick', function(){
        noteElement.setAttribute('contenteditable', 'true');
        noteElement.removeAttribute('draggable');
        noteElement.focus();
    });

    //конец редактирования записи
    noteElement.addEventListener('blur', function(){
        noteElement.removeAttribute('contenteditable');
        if(!noteElement.classList.contains('note')){
            return;
        }else{
            noteElement.setAttribute('draggable', 'true');
        }

        noteElement.closest('.column').setAttribute('draggable', 'true');
        //проверка на пустоту строки
        if(!this.textContent.trim().length){
            this.remove();
        }
        save();

    });
    //DragAndDrop notes (перетаскивание заметок)
    noteElement.addEventListener('dragstart', dragstart_Note);
    noteElement.addEventListener('dragend', dragend_Note);
    noteElement.addEventListener('dragenter', dragenter_Note);
    noteElement.addEventListener('dragover', dragover_Note);
    noteElement.addEventListener('dragleave', dragleave_Note);
    noteElement.addEventListener('drop', drop_Note);


}

//dragstart-Note
function dragstart_Note(event){
       event.stopPropagation();
       draggedElem = this;
       //console.log('+');
       this.classList.add('dragged');
}


//Действия DragAndDrop над заметками

//dragend-Note
function dragend_Note(event){

    draggedElem = null;
   //console.log('-');
    this.classList.remove('dragged');

    document.querySelectorAll('.note')
        .forEach(function(el){
            el.classList.remove('under');
        });
    save();
    event.stopPropagation();
}

//dragenter-Note
function dragenter_Note(event){
    event.stopPropagation();
    if(!draggedElem || this === draggedElem){
        return;
    }

    this.classList.add('under');
   // console.log('enter');
}

//dragover-Note
function dragover_Note(event){
    event.stopPropagation();
    if(!draggedElem || this === draggedElem){
        return;
    }
    event.preventDefault();
}


//dragleave-Note
function dragleave_Note(event){
    event.stopPropagation();

    if(!draggedElem || this === draggedElem){
        return;
    }

    this.classList.remove('under');
    //console.log('leave', this);

}

//drop-Note
function drop_Note(event){
    if(!draggedElem || this === draggedElem){
        return;
    }

    event.stopPropagation();


    //console.log('Drop', this);
   // console.log(draggedElem);

    if(this.parentElement === draggedElem.parentElement){
        let tasks = Array.from(this.parentElement.querySelectorAll('[data-count]'));
        let indexA = tasks.indexOf(this);
        let indexB = tasks.indexOf(draggedElem);

        if(indexA  > indexB){
            this.parentElement.insertBefore(draggedElem, this);
        }else{
            this.parentElement.insertBefore(draggedElem, this.nextElementSibling);
        }
    }else{
        this.parentElement.insertBefore(draggedElem, this);
    }
}


//Добавление данных о заметках и колонках в localStorage


//Метод сохраняет изменения в DOM-дереве и слхраняет в localStorage
function save(){

    let obj = {
        columns: {
            idCounter: columnCount,
            items: []
        },
        notes: {
            idCounter: noteCount,
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


    let json = JSON.stringify(obj);
    console.log(json);

    //Помещаем в localStorage
    localStorage.setItem('trello', json);

}


//Получаем столбцы и заметки из localStorage
function load(){

    //проверка что такой ключ существует в localStorage
    if(!localStorage.getItem('trello')){
        return;
    }
    const montain = document.querySelector('.columns');
    //Очищаем весь дом от старых столбцов и записей
    montain.innerHTML = '';

    const obj = JSON.parse(localStorage.getItem('trello'));

    //Извлекаем индексы элементов из объекта теперь columnCount не будет равнятся 1
    columnCount = obj.columns.idCounter;
    noteCount = obj.notes.idCounter;

    const getNoteById = id => obj.notes.items.find(note => note.id === id);

    for(let column of obj.columns.items){
        const columnElement = createColumnElement(column.id);

        //Отображаем столбцы на экране
        montain.append(columnElement);


        for(let noteId of column.noteIds){
            const note = getNoteById(noteId);

            const noteElement = createNoteElement(note.id, note.content);
            //Выводим записи в колонке
            columnElement.querySelector('.notes').append(noteElement);
        }

    }

}



