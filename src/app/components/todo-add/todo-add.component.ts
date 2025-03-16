import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {ToDoStore} from '../../store/toDo.store';
import {IToDo} from '../../services/model/IToDo';

@Component({
  selector: 'todo-add',
  imports: [CommonModule, FormsModule, TranslateModule,],
  templateUrl: './todo-add.component.html',
  styleUrl: './todo-add.component.scss',
  standalone:true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoAddComponent {
  protected store = inject(ToDoStore);
  protected toDoText:string | undefined;
  protected inFocus:boolean = false;
  protected inMouse:boolean = false;
  protected canShowClear = signal(false);

  protected onEvent(event: FocusEvent){
    if(event.type === 'mouseenter') this.inMouse = true;
    if(event.type === 'mouseleave') this.inMouse = false;
    if(event.type === 'focusin') this.inFocus = true;
    if(event.type === 'focusout') this.inFocus = false;
    if((this.inFocus) || (!this.inFocus && this.inMouse)) {
      this.canShowClear.set(true);
    }else
      this.canShowClear.set(false);
  }

  protected addNewToDoItem(){
    if(this.toDoText!== '' && this.toDoText!== undefined && this.toDoText.trim()!== ''){
      let newItem:IToDo = {text:this.toDoText.trim(), status_id:this.store.statuses()[0].id, status_text:this.store.statuses()[0].status};
      this.store.addToDoItem(newItem);
      this.toDoText = '';
    }
  }

  protected keyDown(event:any){
    if (event.key == 'Enter')
      this.addNewToDoItem();
  }

}
