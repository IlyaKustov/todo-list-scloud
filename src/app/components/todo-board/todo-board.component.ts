import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ToDoStore} from '../../store/toDo.store';
import {TranslatePipe} from '@ngx-translate/core';
import {DndDropEvent, DndModule} from 'ngx-drag-drop';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'todo-board',
  imports: [TranslatePipe, DndModule, CommonModule, FormsModule],
  templateUrl: './todo-board.component.html',
  styleUrl: './todo-board.component.scss',
  standalone:true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoBoardComponent {
  protected readonly store = inject(ToDoStore);

  protected onDrop(event:DndDropEvent, id:number | undefined) {
    let itemId =parseInt(event.data.id);
    let item = this.store.toDoItems().find(i=>i.id === itemId);

    if(!item) {
      console.error('item not found');
      return;
    }
    let newStatus= this.store.statuses().find(status => status.id === id);

    if(!newStatus) {
      console.error('status not found');
      return;
    }

    if(item.status_id !== id){
      item.status_id = newStatus.id;
      item.status_text = newStatus.status;

      this.store.updateToDoItem(item);
    }
  }
}
