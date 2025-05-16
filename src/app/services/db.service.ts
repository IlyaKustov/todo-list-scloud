import {inject, Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {IStatus} from './model/IStatus';
import {catchError, firstValueFrom, map, Observable, of, switchMap, take} from 'rxjs';
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
    return this.dbService.getAll<IStatus>(statuses_table_name).pipe(take(1),
      catchError((err) => {
        console.error('[GetAllStatuses] Error', err);
        return of(this.initValues)
      }),
    )
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
   * @returns {Observable<IToDo>} filled item with id from db
   */
  public AddToDoItem(toDo: IToDo): Observable<IToDo | undefined> {
    return this.dbService.add<IToDo>(todo_table_name, toDo).pipe(take(1),
      catchError((err) => {
        console.error('[AddToDoItem] Error', err);
        return of(undefined)
      }),
    );
  }

  /**
   * Update existing todo item
   * @param {IToDo} toDo - existing todo item
   */
  public UpdateToDoItem(toDo: IToDo): Observable<IToDo | undefined> {
    return this.dbService.update<IToDo>(todo_table_name, toDo).pipe(take(1),
      catchError((err) => {
        console.error('[UpdateToDoItem] Error', err);
        return of(undefined)
      }),
    )
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
   * @returns {Promise<boolean>} return true, if it's all ok, or false if not
   */
  public async Init():Promise<boolean> {
    return firstValueFrom(this.dbService.getAll<IStatus>(statuses_table_name).pipe(take(1),
      catchError((err) => {
        console.error('[Init] get statuses Error', err);
        return of([])
      }),
      switchMap((statuses: IStatus[]) => {
        if (statuses.length === 3) return of(true);
        return this.dbService.bulkAdd<IStatus>(statuses_table_name, this.initValues).pipe(take(1),
          catchError((err) => {
            console.error('[Init] add statuses Error', err);
            return of([])
          }),
          switchMap((addRes: number[]) => {
            return addRes.length === 0 ? of(false) : of(true);
          })
        )
      })
    ));
  }

}
