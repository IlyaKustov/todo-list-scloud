import {inject, Injectable} from '@angular/core';
import {NgxIndexedDBService, WithID} from 'ngx-indexed-db';
import {IStatus} from './model/IStatus';
import {map, Observable, switchMap, take} from 'rxjs';
import {IToDo} from './model/IToDo';
import {statuses_table_name, todo_table_name} from './model/dbConfig';

@Injectable()
export class DbService {
  private dbService = inject(NgxIndexedDBService);

  /**
   * Use to init empty DB
   * @private
   */
  private readonly initValues = [
    {id: 1, status: 'Открыт'},
    {id: 2, status: 'В работе'},
    {id: 3, status: 'Закрыт'}
  ];

  /**
   *  Get array of all statuses
   *  @returns {Observable<IStatus[]>}  all statuses from DB
   */
  public GetAllStatuses(): Observable<IStatus[]> {
    return this.dbService.getAll<IStatus>(statuses_table_name);
  }

  /**
   * Get all todo items form DB. Check's for status text of each todo item
   * @returns {Observable<IToDo[]>} all to do items from DB
   */
  public GetAllToDoItems(): Observable<IToDo[]> {
    return this.GetAllStatuses().pipe(
      switchMap((statuses: IStatus[]) => {
        return this.dbService.getAll<IToDo>(todo_table_name).pipe(
          map((toDoItems: IToDo[]) => {
            toDoItems.forEach(toDoItem => {
              if(toDoItem.status_text === undefined || toDoItem.status_text === ''){
                let statusText = statuses.find(status => status.id === toDoItem.status_id)?.status;

                if(statusText) toDoItem.status_text = statusText;
              }
            });
            return toDoItems;
          })
        )
      })
    )
  }

  /**
   * Add new todo item
   * @param {IToDo} toDo - new todo item
   * @returns {Observable<IToDo & WithID>} filled item with id from db
   */
  public AddToDoItem(toDo: IToDo): Observable<IToDo & WithID> {
    return this.dbService.add<IToDo>(todo_table_name, toDo);
  }

  /**
   * Update existing todo item
   * @param {IToDo} toDo - existing todo item
   */
  public UpdateToDoItem(toDo: IToDo): Observable<IToDo> {
    return this.dbService.update<IToDo>(todo_table_name, toDo);
  }

  /**
   * Delete existing todo item by id
   * @param {number | undefined} id - id of existing todo item
   * @returns {Observable} - return void if success, or observer.error if id is undefined
   */
  public DeleteToDoItem(id: number | undefined): Observable<void> {
    console.log(`[DbService] -> DeleteToDoItem() id:${id}`);
    if (id == undefined) return new Observable<void>(observer => {observer.error('id undefined'); observer.complete()});
    return this.dbService.deleteByKey(todo_table_name, id);
  }

  /**
   * Init DB for first run. Fills statuses table, if it's empty
   * @returns {Observable<boolean>} return true, if it's all ok, or error if not
   */
  public Init(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      let getAllSubs = this.GetAllStatuses()
        .pipe(take(1))
        .subscribe({
          next: (data: IStatus[]) => {
            getAllSubs.unsubscribe();

            if (data.length !== 3) {
              console.log('[DbService] -> Init() statuses empty, start add to db');
              let bulkSubs = this.dbService.bulkAdd<IStatus>(statuses_table_name, this.initValues)
                .pipe(take(1))
                .subscribe({
                  next: (bulkRes: number[]) => {
                    bulkSubs.unsubscribe();
                    console.log('[DbService] -> Init() statuses added to db', bulkRes);
                    observer.next(true);
                    observer.complete();
                  },
                  error: (bulkErr) => {
                    bulkSubs.unsubscribe();
                    console.error('[DbService] -> Init() Error while adding statuses', bulkErr);
                    observer.error(bulkErr);
                    observer.complete();
                  }
                })
            }else {
              observer.next(true);
              observer.complete();
            }
          },
          error: (err) => {
            getAllSubs.unsubscribe();
            console.log('Error statuses', err);
            observer.error(err);
            observer.complete();
          }
        })
    })
  }
}
