import { createAction, props } from '@ngrx/store';

export const loadTodoLists = createAction(
  '[TodoList] Load TodoLists'
);

export const initTodoListItems = createAction(
  '[TodoList] Initial Todo Items'
);
