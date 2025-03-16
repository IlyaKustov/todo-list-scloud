import {IStatus} from '../services/model/IStatus';
import {IToDo} from '../services/model/IToDo';
import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';
import {computed, DestroyRef, inject} from '@angular/core';
import {DbService} from '../services/db.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from "@ngrx/operators";

type StoreState = {
  isLoading: boolean;
  statuses: IStatus[];
  toDoItems: IToDo[];
};

const initialState:StoreState = {
  isLoading:false,
  statuses:[],
  toDoItems:[]
};

export const ToDoStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({statuses, toDoItems})=>({
    openCount: computed(() => toDoItems().filter(item=>item.status_id === statuses()[0].id).length),
    workCount: computed(() => toDoItems().filter(item=>item.status_id === statuses()[1].id).length),
    closedCount: computed(() => toDoItems().filter(item=>item.status_id === statuses()[2].id).length),
    sortedToDoItems: computed(()=>toDoItems().sort((a,b)=> {
      if (a.status_id !== undefined && b.status_id !== undefined) {
        if (a.status_id < b.status_id) return -1;
        else if (a.status_id > b.status_id) return 1;
        return 0
      }
      return 0;
    }))
  })),

  withHooks((store, service = inject(DbService), destroyRef = inject(DestroyRef)) => {
    return {
      onInit() {
        service.Init().pipe(takeUntilDestroyed(destroyRef)).subscribe({
          next: () => {
            service.GetAllStatuses().pipe(takeUntilDestroyed(destroyRef)).subscribe(
              (statusesItems: IStatus[]) => patchState(store, {statuses: statusesItems})
            );

            service.GetAllToDoItems().pipe(takeUntilDestroyed(destroyRef)).subscribe(
              (items: IToDo[]) => patchState(store, {toDoItems: items})
            );
          },
          error: (error) => {
            console.error('[ToDoStore] -> Init() Error', error);
            //TODO: Show error on interface
          }
        })
      }
    }
  }),

  withMethods((store, service = inject(DbService)) => {
    const addToDoItem = rxMethod<IToDo>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((item: IToDo) => {
          if (!item.status_text) {
            let status = store.statuses().find(status => status.id == item.status_id)?.status;
            if(status) item.status_text = status;
          }
          return service.AddToDoItem(item).pipe(
            tapResponse({
              next: (value: IToDo) => {
                patchState(store, (state: StoreState) => ({isLoading: false, toDoItems: [...state.toDoItems, value]}))
              },
              error: (err) => {
                patchState(store, {isLoading: false});
                console.error('[ToDoStore] -> addToDoItem() ERROR', err);
              },
            })
          )

        })
      )
    )

    const deleteToDoItem = rxMethod<IToDo>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((item: IToDo) => {
          return service.DeleteToDoItem(item.id).pipe(
            tapResponse({
              next: () => {
                let existItem = store.toDoItems().find(_item=>_item.id === item.id);
                if(existItem!==undefined){
                  let index = store.toDoItems().indexOf(existItem);
                  let items = store.toDoItems();
                  items.splice(index, 1);

                  patchState(store, {isLoading: false, toDoItems: [...items]})
                }else{
                  console.warn(`[ToDoStore] -> deleteToDoItem() toDo item not found for id:${item.id}`);
                }
              },
              error: (err) => {
                patchState(store, {isLoading: false});
                console.error('[ToDoStore] -> deleteToDoItem() ERROR', err);
              },
            })
          )

        })
      )
    )

    const updateToDoItem = rxMethod<IToDo>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((item: IToDo) => {
          return service.UpdateToDoItem(item).pipe(
            tapResponse({
              next: () => {
                let existItem = store.toDoItems().find(_item=>_item.id === item.id);
                if(existItem!==undefined){
                  let index = store.toDoItems().indexOf(existItem);
                  let items = store.toDoItems();
                  items[index] = item;
                  patchState(store, {isLoading: false, toDoItems: [...items]})
                }

              },
              error: (err:Error) => {
                patchState(store, {isLoading: false});
                console.error('[ToDoStore] -> updateToDoItem() ERROR', err);
              },
            })
          )

        })
      )
    )

    return {addToDoItem, deleteToDoItem, updateToDoItem}

  })
)
