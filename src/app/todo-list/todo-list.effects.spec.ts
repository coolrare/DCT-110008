import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { TodoListEffects } from './todo-list.effects';

describe('TodoListEffects', () => {
  let actions$: Observable<any>;
  let effects: TodoListEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoListEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(TodoListEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
