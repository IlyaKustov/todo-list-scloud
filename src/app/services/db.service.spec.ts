import {fakeAsync, TestBed} from '@angular/core/testing';
import {DbService} from './db.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {of} from 'rxjs';
import {IStatus} from './model/IStatus';
import {IToDo} from './model/IToDo';
import {statuses_table_name, todo_table_name} from './model/dbConfig';

describe('DbService', () => {
  const status_1: IStatus = {id: 1, status: 'Открыт'};
  const status_2: IStatus = {id: 2, status: 'В работе'};
  const status_3: IStatus = {id: 3, status: 'Закрыт'};
  const toDo_1: IToDo = {id:1, text: 'To do text 1', status_id: status_1.id, status_text: status_1.status};
  const toDo_2: IToDo = {id:2, text: 'To do text 2', status_id: status_2.id, status_text: status_2.status};
  const toDo_3: IToDo = {id:3, text: 'To do text 3', status_id: status_3.id, status_text: status_2.status};

  const mockNgxIndexedDBService = {
    getAll:(storeName: string)=> {
      if(storeName === statuses_table_name) return of([status_1, status_2, status_3])
      if(storeName === todo_table_name) return of([toDo_1, toDo_2, toDo_3]);
      return of([]);
    },
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [DbService,{provide: NgxIndexedDBService, useValue: mockNgxIndexedDBService}]
    })
  });

  it('should created service', () => {
    const service = TestBed.inject(DbService);
    expect(service).toBeTruthy()
    expect(service).not.toBeNaN();
    expect(service).not.toBeNull();
    expect(service).not.toBeUndefined();
  });

  it('should return statuses', fakeAsync(() => {
    const service = TestBed.inject(DbService);
    expect(service).toBeTruthy()

    service.GetAllStatuses().subscribe({
      next:(res)=>{
        expect(res).toBeTruthy();
        expect(res?.length).toBe(3);
      }
    })
  }))

  it('should return todo items and fill status text on each item', fakeAsync(() => {
    const service = TestBed.inject(DbService);
    expect(service).toBeTruthy()

    service.GetAllToDoItems().subscribe({
      next:(res)=>{
        expect(res).toBeTruthy();
        expect(res?.length).toBe(3);

        expect(res[0].status_text).not.toBeUndefined()
      }
    })
  }))
})
