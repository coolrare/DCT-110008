import { Pagination } from './pagination';
import { createAction, props } from '@ngrx/store';
import { TodoItem } from './todo-item';

export const loadTodoLists = createAction(
  '[TodoList] Load TodoLists'
);

export const initTodoListItems = createAction(
  '[TodoList] Initial Todo Items'
);

export const updateTodoListItems = createAction(
  '[TodoList] Update Todo Items',
  props<Pagination<TodoItem>>()
);
