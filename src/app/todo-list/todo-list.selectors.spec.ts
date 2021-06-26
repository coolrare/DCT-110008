import * as fromTodoList from './todo-list.reducer';
import { selectTodoListState } from './todo-list.selectors';

describe('TodoList Selectors', () => {
  it('should select the feature state', () => {
    const result = selectTodoListState({
      [fromTodoList.todoListFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
