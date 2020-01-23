//Класс отвечает за создание колонок в приложении и работа над ними
class Column{
    constructor(id = null){
        //Создание новой колонки
        let element = this.element = document.createElement('div');
        let app = new Application;
        element.classList.add('column');

        element.setAttribute('draggable', 'true');

        if(id){
            element.setAttribute('data-column-id', id);
        }else{
            element.setAttribute('data-column-id', ++Column.columnCount);
        }

        element.innerHTML = `
        <p class="column-header">В плане</p>
					<div class="notes"></div>
					<p class="column-footer">
						<span data-action-addNote class="action">+ Добавить карточку</span>
					</p>
        
        `;

        //Действие над элементами колонки
        //Добавление заметки - note
        let addNote = element.querySelector('[data-action-addNote]');
        addNote.addEventListener('click', function(){
            let note = new Note();

            element.querySelector('.notes').appendChild(note.element);

            //Заполнение новой задачи
            note.element.setAttribute('contenteditable', 'true');
            note.element.focus();
        });

        //Редактирование заголовков в колонке
        let elementHeader = element.querySelector('.column-header');
        elementHeader.addEventListener('dblclick', function(){
            elementHeader.setAttribute('contenteditable', 'true');
            elementHeader.removeAttribute('draggable');
            elementHeader.focus();
        });

        elementHeader.addEventListener('blur', function(){
            elementHeader.removeAttribute('contenteditable');
        });

        //Перетаскивание задачи в новую колонку
        element.addEventListener('dragover', function(event) {
            event.preventDefault();
        });
        element.addEventListener('drop', function(){
            if(Note.draggedElem){
                return element.querySelector('.notes').append(Note.draggedElem);
            }
        });

        //Перетаскивание колонок
        //Начало перетаскивания колонки
        element.addEventListener('dragstart', this.dragstart.bind(this));
        //Конец претаскивания колонки
        element.addEventListener('dragend', this.dragend.bind(this));

        //Перетаскивание элемента над колонкой
        element.addEventListener('dragover', this.dragover.bind(this));

        element.addEventListener('drop', this.drop.bind(this));
    }


    //Действия DragAndDrop над колонками
    //dragstart - начало перетаскивания колонки
    dragstart(event){

        Column.draggedColumn = this;
        this.element.classList.add('dragged');
        //console.log('dragstart-Column');

        //всем записям в колонке удаляем атрибут переноса
        document.querySelectorAll('.note')
            .forEach((notElement) => {notElement.removeAttribute('draggable')});
    }

    //dragend - момент отпускания клавиши мыши - конец перетаскивания колонки

    dragend(){
        Column.draggedColumn  = null;
        Column.droppedColumn = null;

        //убираем класс у активной колонки при перетаскивании
        this.element.classList.remove('dragged');
        //console.log('dragend_Column');

        //Убираем затемнение у всех колонок
        document.querySelectorAll('.column')
            .forEach(function(el){
                el.classList.remove('under');
            });

        //всем записям в колонке добавляем атрибут переноса
        document.querySelectorAll('.note')
            .forEach((notElement) => {notElement.setAttribute('draggable', 'true')});
        app.save();
    }


    //dragover
    dragover(event){

        event.preventDefault();

        if(Column.draggedColumn === this){
            if(Column.droppedColumn){
                Column.droppedColumn.classList.remove('under');
            }
            Column.droppedColumn = null;
        }

        if(!Column.draggedColumn || Column.draggedColumn === this){
            return;
        }
        Column.droppedColumn = this;
        //Убираем затемнение у всех колонок
        document.querySelectorAll('.column')
            .forEach(function(columnElement){
                columnElement.classList.remove('under');
            });

        this.element.classList.add('under');

    }


    //drop - вставка перетаскиваемого объекта
    drop(event){

        if(Column.draggedElem){
            this.element.querySelector('.notes').append(Column.draggedElem);
        }else if(Column.draggedColumn){

            const children = Array.from(document.querySelector('.columns').children);
            const indexA = children.indexOf(this.element);
            const indexB = children.indexOf(Column.draggedColumn.element);
            //сравнивания индексов колонок и меняем местами
            console.log(indexA, indexB);
            if(indexA < indexB){
                document.querySelector('.columns').insertBefore(Column.draggedColumn.element, this.element);
            }else{
                document.querySelector('.columns').insertBefore(Column.draggedColumn.element, this.element.nextElementSibling);
            }
        }

        //Убираем затемнение у всех колонок
        document.querySelectorAll('.column')
            .forEach(function(columnElement){
                columnElement.classList.remove('under');
            });
    }

}


Column.columnCount = 1; //начальный индекс колонки

Column.draggedColumn = null;//перетаскиваемая колонка
Column.droppedColumn = null;//отслеживаем drop на элементе
