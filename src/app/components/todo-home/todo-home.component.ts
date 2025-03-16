import { Component } from '@angular/core';
import {LanguageChangeComponent} from "../language-change/language-change.component";
import {TodoAddComponent} from "../todo-add/todo-add.component";
import {TodoBoardComponent} from "../todo-board/todo-board.component";
import {TodoCurrentCountsComponent} from "../todo-current-counts/todo-current-counts.component";
import {TodoListComponent} from "../todo-list/todo-list.component";

@Component({
  selector: 'todo-home',
    imports: [
        LanguageChangeComponent,
        TodoAddComponent,
        TodoBoardComponent,
        TodoCurrentCountsComponent,
        TodoListComponent
    ],
  templateUrl: './todo-home.component.html',
  styleUrl: './todo-home.component.scss'
})
export class TodoHomeComponent {
}
