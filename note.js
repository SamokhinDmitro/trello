//Класс отвечает за создание заметок и их обработку
class Note{
    constructor(id = null, content = ''){
       const element = this.element = document.createElement('div');
       let app = new Application;
        element.classList.add('note');
        element.setAttribute('draggable', 'true');
        element.textContent = content;
        if(id){
            element.setAttribute('data-note-id', id);
        }else{
            element.setAttribute('data-note-id', ++Note.noteCount);

        }

        //Редактирование задач
        //начало редактирования записи
        element.addEventListener('dblclick', function(){
            element.setAttribute('contenteditable', 'true');
            element.removeAttribute('draggable');
            element.focus();
        });

        //конец редактирования записи
        element.addEventListener('blur', function(){
            element.removeAttribute('contenteditable');
            if(!element.classList.contains('note')){
                return;
            }else{
                element.setAttribute('draggable', 'true');
            }

            element.closest('.column').setAttribute('draggable', 'true');
            //проверка на пустоту строки
            if(!element.textContent.trim().length){
                element.remove();
            }
            app.save();

        });
        //DragAndDrop notes (события перетаскивание заметок)
        element.addEventListener('dragstart', this.dragstart.bind(this));
        element.addEventListener('dragend', this.dragend.bind(this));
        element.addEventListener('dragenter', this.dragenter.bind(this));
        element.addEventListener('dragover', this.dragover.bind(this));
        element.addEventListener('dragleave', this.dragleave.bind(this));
        element.addEventListener('drop', this.drop.bind(this));

    }


    //Действия DragAndDrop над заметками
    //dragstart-начало перетаскивание заметки
    dragstart(event){
        event.stopPropagation();
        Note.draggedElem = this.element;

        this.element.classList.add('dragged');
    }

    //dragend-конец перетасуивание заметки
    dragend(event){

        Note.draggedElem = null;
        //Убираем класс у перетаскиваемого элемента
        this.element.classList.remove('dragged');

        document.querySelectorAll('.note')
            .forEach(function(el){
                el.classList.remove('under');
            });
        //Сохраняем изменение в localStorage
        app.save();
        event.stopPropagation();
    }

    //dragenter - событие возникает над принимающем элементом
    dragenter(event){
        //Предотвращение всплытия элемента вверх по DOM-дереву
        event.stopPropagation();
        //Проверка что перетаскивание происходит не над перетаскиваемым объектом
        if(!Note.draggedElem || this.element === Note.draggedElem){
            return;
        }

        this.element.classList.add('under');

    }

    //dragover
    dragover(event){
        event.stopPropagation();
        //Проверка что перетаскивание происходит не над перетаскиваемым объектом
        if(!Note.draggedElem || this.element === Note.draggedElem){
            return;
        }
        //Предотвращение стандартного поведения
        event.preventDefault();
    }


    //dragleave - перетаскиваемый элемент покидает область над принимающем объектом
    dragleave(event){
        event.stopPropagation();

        if(!Note.draggedElem || this.element === Note.draggedElem){
            return;
        }

        this.element.classList.remove('under');

    }

    //drop
    drop(event){
        if(!Note.draggedElem || this.element === Note.draggedElem){
            return;
        }

        event.stopPropagation();

        //если заметки имеют общий родительский элемент
        if(this.element.parentElement === Note.draggedElem.parentElement){
            let tasks = Array.from(this.element.parentElement.querySelectorAll('[data-count]'));
            let indexA = tasks.indexOf(this.element);
            let indexB = tasks.indexOf(Note.draggedElem);
            //сравнение индексов двух элементов
            if(indexA  > indexB){
                this.element.parentElement.insertBefore(Note.draggedElem, this.element);
            }else{
                this.element.parentElement.insertBefore(Note.draggedElem, this.element.nextElementSibling);
            }

        }else{
            this.element.parentElement.insertBefore(Note.draggedElem, this.element);
        }
    }
}


Note.draggedElem = null; //перетаскиваемая заметка
Note.noteCount = 1; //начальный индекс заметки
