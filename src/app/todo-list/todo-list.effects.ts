import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { concatMap } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';

import * as TodoListActions from './todo-list.actions';


@Injectable()
export class TodoListEffects {


  loadTodoLists$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(TodoListActions.loadTodoLists),
      /** An EMPTY observable only emits completion. Replace with your own observable API request */
      concatMap(() => EMPTY as Observable<{ type: string }>)
    );
  });


  constructor(private actions$: Actions) {}

}
