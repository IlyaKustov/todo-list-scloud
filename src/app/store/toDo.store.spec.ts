import {Observable, of} from 'rxjs';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ToDoStore} from './toDo.store';
import {DbService} from '../services/db.service';
import {IStatus} from '../services/model/IStatus';
import {IToDo} from '../services/model/IToDo';

describe('toDoStore', () => {
  const status_1: IStatus = {id: 1, status: 'Открыт'};
  const status_2: IStatus = {id: 2, status: 'В работе'};
  const status_3: IStatus = {id: 3, status: 'Закрыт'};

  const toDo_1: IToDo = {id:1, text: 'To do text 1', status_id: status_1.id, status_text: status_1.status}
  const toDo_2: IToDo = {id:2, text: 'To do text 2', status_id: status_2.id, status_text: status_2.status}
  const toDo_3: IToDo = {id:3, text: 'To do text 3', status_id: status_3.id, status_text: status_3.status}

  const mockDbService = {
    GetAllStatuses: (): Observable<IStatus[]> => {
      console.log('mock GetAllStatuses');
      return of([status_1, status_2, status_3])
    },
    GetAllToDoItems: (): Observable<IToDo[]> => of([toDo_1, toDo_2, toDo_3]),
    UpdateToDoItem: (item: IToDo): Observable<IToDo> => of(item),
    AddToDoItem: (item: IToDo): Observable<IToDo> => of(item),
    Init: async (): Promise<boolean> => {
      console.log('mock INIT');
      return Promise.resolve(true);
    },
    DeleteToDoItem: (id: number | undefined) => {
      if (id == undefined) return new Observable<void>(observer => observer.error('id undefined'));
      else return of(undefined)
    },
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [ToDoStore, {provide: DbService, useValue: mockDbService}]
    })
  });

  it('should created toDo store', () => {
    const store = TestBed.inject(ToDoStore);
    expect(store).toBeTruthy()
    expect(store).not.toBeNaN();
    expect(store).not.toBeNull();
    expect(store).not.toBeUndefined();
  });

  it('should have initial values', fakeAsync(() => {
    const store = TestBed.inject(ToDoStore);
    expect(store).toBeTruthy();
    tick();
    expect(store.statuses()).toBeTruthy();
    expect(store.statuses().length).toBe(3);
    expect(store.toDoItems()).toBeTruthy();
    expect(store.toDoItems().length).toBe(3);
  }));

  it('should add new todo item', fakeAsync(() => {
    const store = TestBed.inject(ToDoStore);
    expect(store).toBeTruthy();
    tick();
    let newItem:IToDo = {text:'new item text', status_id:status_1.id, status_text:status_1.status, id:555};
    store.addToDoItem(newItem);
    tick();

    expect(store.toDoItems().length).toBe(4);

    let found = store.toDoItems().find(todo=>todo.id == newItem.id);

    expect(found).toBeTruthy();
    expect(found?.id).toEqual(newItem.id);
    expect(found?.status_id).toEqual(newItem.status_id);
    expect(found?.status_text).toEqual(newItem.status_text);
    expect(found?.text).toEqual(newItem.text);
  }));

  it('should update todo item', fakeAsync(() => {
    const store = TestBed.inject(ToDoStore);
    expect(store).toBeTruthy();
    tick();
    expect(store.toDoItems().length).toBe(3);
    let item = store.toDoItems()[0];
    item.text = 'changed text';
    item.status_id = status_3.id;
    item.status_text = status_3.status;

    store.updateToDoItem(item);
    tick();
    expect(store.toDoItems().length).toBe(3);
    let _item = store.toDoItems()[0];

    expect(_item).toBeTruthy();
    expect(_item?.id).toEqual(item.id);
    expect(_item?.status_id).toEqual(item.status_id);
    expect(_item?.status_text).toEqual(item.status_text);
    expect(_item?.text).toEqual(item.text);

  }));

  it('should delete todo item', fakeAsync(() => {
    const store = TestBed.inject(ToDoStore);
    expect(store).toBeTruthy();
    tick();
    expect(store.toDoItems().length).toBe(3);
    let item = store.toDoItems()[0];

    store.deleteToDoItem(item);
    tick();
    expect(store.toDoItems().length).toBe(2);

    expect(store.toDoItems().find(_item=>_item.id === item.id)).toBeUndefined();
  }));


});
