import {DBConfig} from 'ngx-indexed-db';

export const statuses_table_name = 'statuses';
export const todo_table_name = 'toDoists';

export const dbConfig: DBConfig  = {
  name: 'ToDoDb',
  version: 1,
  objectStoresMeta: [{
    store: statuses_table_name,
    storeConfig: {keyPath: 'id', autoIncrement: true},
    storeSchema: [
      {name: 'status', keypath: 'status', options: {unique: true}},
    ]
  }, {
    store: todo_table_name,
    storeConfig: {keyPath: 'id', autoIncrement: true},
    storeSchema: [
      {name: 'status_id', keypath: 'status_id', options: {unique: false}},
      {name: 'text', keypath: 'text', options: {unique: false}}
    ]
  }]
};
