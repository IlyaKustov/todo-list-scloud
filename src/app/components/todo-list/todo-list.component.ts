import {
  ChangeDetectionStrategy,
  Component,
  computed, ElementRef,
  inject,
  input,
  InputSignal,
  Signal,
  signal,
  TemplateRef, ViewChild
} from '@angular/core';
import {ToDoStore} from '../../store/toDo.store';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {IToDo} from '../../services/model/IToDo';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'todo-list',
  imports: [CommonModule, FormsModule, TranslateModule,],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
  standalone:true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {
  protected readonly store = inject(ToDoStore);
  protected modalService = inject(BsModalService);
  protected modalRef?: BsModalRef;
  protected readonly hideCaption = 'Hide';
  protected readonly showMoreCaption = 'Show more';
  protected ToDoItems: InputSignal<IToDo[] | undefined> = input<IToDo[]>();
  protected toDoItemCopy:IToDo = {text:'',status_id:0, status_text:''};
  protected firstFiveItems: Signal<IToDo[]> = computed(() => this.store.sortedToDoItems().slice(0,5));
  protected fullMode = signal(false);
  protected buttonText = signal(this.showMoreCaption);

  @ViewChild('scrollTo')
  private scrollToElement: ElementRef | undefined;

  protected invertShowItemsList() {
    if (this.fullMode())
      this.scrollToElement?.nativeElement.scrollIntoView({block: 'nearest', behavior: 'smooth'});

    this.fullMode.set(!this.fullMode());

    if (this.fullMode())
      this.buttonText.set(this.hideCaption);
    else
      this.buttonText.set(this.showMoreCaption);
  }

  protected openModal(template: TemplateRef<void>, toDoItem:IToDo) {
    this.toDoItemCopy = {id:toDoItem.id, status_id:toDoItem.status_id, text:toDoItem.text, status_text:toDoItem.status_text};
    this.modalRef = this.modalService.show(template,{backdrop: true, animated:true, keyboard:true});
  }

  protected updateToDo(){
    this.modalRef?.hide();
    this.store.updateToDoItem(this.toDoItemCopy);
  }

  protected deleteToDo(){
    this.modalRef?.hide();
    this.store.deleteToDoItem(this.toDoItemCopy);
  }

  protected cancelEdit(){
    this.modalRef?.hide();
    this.toDoItemCopy = {text:'',status_id:0, status_text:''};
  }

  protected setStatus(id:number){
    this.toDoItemCopy.status_id = this.store.statuses()[id].id;
    this.toDoItemCopy.status_text = this.store.statuses()[id].status;
    this.updateToDo();
  }
}
