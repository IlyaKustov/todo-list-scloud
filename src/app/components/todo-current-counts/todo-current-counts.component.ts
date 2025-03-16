import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ToDoStore} from '../../store/toDo.store';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'todo-current-counts',
  imports: [CommonModule, FormsModule, TranslateModule,],
  templateUrl: './todo-current-counts.component.html',
  styleUrl: './todo-current-counts.component.scss',
  standalone:true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoCurrentCountsComponent {
  protected store = inject(ToDoStore);
}
