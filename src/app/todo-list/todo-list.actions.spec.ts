import * as fromTodoList from './todo-list.actions';

describe('loadTodoLists', () => {
  it('should return an action', () => {
    expect(fromTodoList.loadTodoLists().type).toBe('[TodoList] Load TodoLists');
  });
});
