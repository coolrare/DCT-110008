import { TodoListService } from './todo-list.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { concatMap, switchMap, map } from 'rxjs/operators';
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

  getSuggestList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoListActions.querySuggestList),
      switchMap(action => this.todoListService.getSuggestList(action.keyword)),
      map((result: string[]) => TodoListActions.updateSuggestList({ suggestList: result }))
    );
  });


  constructor(private actions$: Actions, private todoListService: TodoListService) {}

}
