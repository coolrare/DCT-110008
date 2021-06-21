import { TodoItem } from './todo-item';
import { Action, createReducer, on } from '@ngrx/store';
import * as TodoListActions from './todo-list.actions';
import { Pagination } from './pagination';

export const todoListFeatureKey = 'todoList';

export interface State {
  todoItems: Pagination<TodoItem>;
  suggestList: string[];
  loading: boolean;
  errorMessage: string;
}

export const initialState: State = {
  todoItems: {
    totalCount: 0,
    data: []
  },
  suggestList: [],
  loading: false,
  errorMessage: ''
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
  on(TodoListActions.queryTodoItems, (state, action) => ({
    ...state,
    loading: true,
    errorMessage: ''
  })),
  on(TodoListActions.updateTodoListItems, (state, action) => ({
    ...state,
    todoItems: {
      totalCount: action.totalCount,
      data: action.data
    },
    loading: false,
    errorMessage: ''
  })),
  on(TodoListActions.queryTodoItemsFail, (state, action) => ({
    ...state,
    todoItems: {
      totalCount: 0,
      data: []
    },
    loading: false,
    errorMessage: action.message
  })),
  on(TodoListActions.updateSuggestList, (state, action) => ({
    ...state,
    suggestList: [...action.suggestList]
  }))
);

