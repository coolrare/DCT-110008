import { PageChangeEvent } from './page-change-event';
import { SortChangeEvent } from './sort-change-event';
import { Pagination } from './pagination';
import { createAction, props } from '@ngrx/store';
import { TodoItem } from './todo-item';

export const loadTodoLists = createAction(
  '[TodoList] Load TodoLists'
);

export const initTodoListItems = createAction(
  '[TodoList] Initial Todo Items'
);

export const queryTodoItems = createAction(
  '[TodoList] Query Todo Items',
  props<{ keyword: string, sort: SortChangeEvent, pagination: PageChangeEvent }>()
);

export const updateTodoListItems = createAction(
  '[TodoList] Update Todo Items',
  props<Pagination<TodoItem>>()
);

export const querySuggestList = createAction(
  '[TodoList] Query Suggest List',
  props<{ keyword: string }>()
);

export const updateSuggestList = createAction(
  '[TodoList] Update Suggest List',
  props<{ suggestList: string[] }>()
)
