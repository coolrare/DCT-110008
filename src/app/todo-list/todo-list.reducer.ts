import { TodoItem } from './todo-item';
import { Action, createReducer, on } from '@ngrx/store';
import * as TodoListActions from './todo-list.actions';
import { Pagination } from './pagination';

export const todoListFeatureKey = 'todoList';

export interface State {
  todoItems: Pagination<TodoItem>
}

export const initialState: State = {
  todoItems: {
    totalCount: 0,
    data: []
  }
};

export const reducer = createReducer(
  initialState,

  on(TodoListActions.loadTodoLists, state => state),
  on(TodoListActions.initTodoListItems, state => ({
    ...state,
    todoItems: {
      totalCount: 2,
      data: [
        { id: '1', text: 'Task 1', done: true, created: (new Date()).getTime() },
        { id: '2', text: 'Task 2', done: false, created: (new Date()).getTime() }
      ]
    }
  })),
  on(TodoListActions.updateTodoListItems, (state, action) => ({
    ...state,
    todoItems: {
      totalCount: action.totalCount,
      data: action.data
    }
  }))
);

