import { Pagination } from './pagination';
import { Action, createReducer, on } from '@ngrx/store';
import * as TodoListActions from './todo-list.actions';
import { TodoItem } from './todo-item';

export const todoListFeatureKey = 'todoList';

export interface State {
  todoList: Pagination<TodoItem>;
}

export const initialState: State = {
  todoList: {
    totalCount: 0,
    data: []
  }
};


export const reducer = createReducer(
  initialState,

  on(TodoListActions.loadTodoLists, state => state),
  on(TodoListActions.loadTodoListsSuccess, (state, action) => state),
  on(TodoListActions.loadTodoListsFailure, (state, action) => state),

  on(TodoListActions.loadDefaultTodos, ( state, action ) => {
    console.log(state);
    // const data = {
    //   ...state,
    //   todoList: {
    //     totalCount: action.totalCount,
    //     data: action.data
    //   }
    // };
    // console.log(data);
    return {
      ...state,
      todoList: {
        totalCount: action.totalCount,
        data: action.data
      }
    }
  })

);

