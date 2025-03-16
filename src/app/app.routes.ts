import { Routes } from '@angular/router';
import {TodoHomeComponent} from './components/todo-home/todo-home.component';
import {TodoBoardComponent} from './components/todo-board/todo-board.component';

export const routes: Routes = [
  { path: 'home', component: TodoHomeComponent, title: 'ToDo List Scloud' },
  { path: 'board', component: TodoBoardComponent, title: 'ToDo List Scloud board' },
  { path: '', redirectTo: 'home',  pathMatch: 'full' },
  { path: '**', redirectTo: 'home'}
];
