import { Action, createReducer, on } from '@ngrx/store';
import * as TodoListActions from './todo-list.actions';

export const todoListFeatureKey = 'todoList';

export interface State {

}

export const initialState: State = {

};


export const reducer = createReducer(
  initialState,

  on(TodoListActions.loadTodoLists, state => state),
  on(TodoListActions.loadTodoListsSuccess, (state, action) => state),
  on(TodoListActions.loadTodoListsFailure, (state, action) => state),

);

