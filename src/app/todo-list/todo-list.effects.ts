import { HttpErrorResponse } from '@angular/common/http';
import { TodoListService } from './todo-list.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { concatMap, switchMap, map, filter, debounceTime, distinctUntilChanged, finalize, catchError } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';

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

  querySuggestList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoListActions.querySuggestList),
      map(action => action.keyword),
      filter(keyword => keyword.length >= 3),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(keyword => this.todoListService.getSuggestList(keyword)),
      map((result: string[]) => TodoListActions.updateSuggestList({ suggestList: result }))
    );
  });

  queryTodoItems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoListActions.queryTodoItems),
      debounceTime(0),
      switchMap(action =>
        this.todoListService.getTodoList(action.keyword, action.pagination, action.sort)
          .pipe(
            map(result => TodoListActions.updateTodoListItems(result)),
            catchError((error: HttpErrorResponse) => of(TodoListActions.queryTodoItemsFail({ message: error.error.message })))
          )
      )
    )
  });

  constructor(private actions$: Actions, private todoListService: TodoListService) {}
}
