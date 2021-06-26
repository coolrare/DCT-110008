import { Pagination } from './pagination';
import { createAction, props } from '@ngrx/store';
import { TodoItem } from './todo-item';

export const loadTodoLists = createAction(
  '[TodoList] Load TodoLists'
);

export const loadTodoListsSuccess = createAction(
  '[TodoList] Load TodoLists Success',
  props<{ data: any }>()
);

export const loadTodoListsFailure = createAction(
  '[TodoList] Load TodoLists Failure',
  props<{ error: any }>()
);

export const loadDefaultTodos = createAction(
  '[TodoList] Load Default Todo List',
  props<Pagination<TodoItem>>());
  // props -> properties
