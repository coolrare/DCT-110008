import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTodoList from './todo-list.reducer';

export const selectTodoListState = createFeatureSelector<fromTodoList.State>(
  fromTodoList.todoListFeatureKey
);

export const selectTodoItems = createSelector(
  selectTodoListState,
  state => state.todoItems
);

export const selectTodoItemsData = createSelector(
  selectTodoItems,
  todoItems => todoItems.data
)

export const selectTodoItemsTotalCount = createSelector(
  selectTodoItems,
  todoItems => todoItems.totalCount
)

export const selectSuggestList = createSelector(
  selectTodoListState,
  state => state.suggestList
);
