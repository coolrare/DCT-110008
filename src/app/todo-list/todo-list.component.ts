import { Store } from '@ngrx/store';
import { switchMap, startWith, filter, distinctUntilChanged, debounceTime, map, shareReplay, tap, finalize, catchError } from 'rxjs/operators';
import { Subject, combineLatest, BehaviorSubject, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TodoItemStatusChangeEvent } from './todo-item-status-change-event';
import { PageChangeEvent } from './page-change-event';
import { SortChangeEvent } from './sort-change-event';
import { TodoListAddDialogComponent } from './todo-list-add-dialog/todo-list-add-dialog.component';
import { TodoListService } from './todo-list.service';
import { TodoItem } from './todo-item';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as TodoListActions from './todo-list.actions';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  keyword$ = new Subject<string>();
  suggestList$ = this.keyword$.pipe(
    filter(keyword => keyword.length >= 3),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(keyword => this.todoListService.getSuggestList(keyword)),
    startWith([])
  );

  searchKeyword$ = new BehaviorSubject<string>('');
  sort$ = new BehaviorSubject<SortChangeEvent>({
    sortColumn: 'created',
    sortDirection: 'desc'
  });
  pagination$ = new BehaviorSubject<PageChangeEvent>({
    pageNumber: 1,
    pageSize: 10
  });

  todoListQuery$ = combineLatest([
    this.searchKeyword$,
    this.pagination$,
    this.sort$
  ]).pipe(
    debounceTime(0),
    tap(() => this.loading$.next(true)),
    switchMap(([keyword, pagination, sort]) => this.getTodoListRequest(keyword, pagination, sort)),
    startWith({
      totalCount: 0,
      data: []
    }),
    shareReplay(1)
  );

  todoItems$ = this.todoListQuery$.pipe(
    map(result => result.data)
  );

  totalCount$ = this.todoListQuery$.pipe(
    map(result => result.totalCount)
  );

  loading$ = new BehaviorSubject<boolean>(false);

  totalCount = 0;
  todoList: TodoItem[] = [];

  keyword = '';
  sort: SortChangeEvent = {
    sortColumn: 'created',
    sortDirection: 'desc'
  };
  pagination: PageChangeEvent = {
    pageNumber: 1,
    pageSize: 10
  };

  loading = false;

  constructor(
    private store: Store,
    private todoListService: TodoListService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.store.dispatch(TodoListActions.initTodoListItems());
  }

  setSuggestList(keyword: string) {
    this.keyword$.next(keyword);
  }

  getTodoListRequest(keyword: string, pagination: PageChangeEvent, sort: SortChangeEvent) {
    return this
      .todoListService
      .getTodoList(keyword, pagination, sort)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            alert(error.error.message);
            return of({
              totalCount: 0,
              data: []
            })
          }),
          finalize(() => this.loading$.next(false))
        );
  }

  sortChange(event: SortChangeEvent) {
    this.sort$.next(event);
  }

  refresh() {
    this.searchKeyword$.next(this.searchKeyword$.value);
  }

  pageChange(event: PageChangeEvent) {
    this.pagination$.next({
      pageNumber: event.pageNumber + 1,
      pageSize: event.pageSize
    });
  }

  displayTodoDialog() {
    this.dialog
      .open(TodoListAddDialogComponent)
      .afterClosed()
      .pipe(
        filter(text => text !== ''),
        switchMap(text => this.todoListService.addTodo(text))
      )
      .subscribe(() => {
        this.refresh();
      });
  }

  resetSortAndPage() {
    this.sort$.next({
      sortColumn: 'created',
      sortDirection: 'desc'
    });
    this.pagination$.next({
      pageNumber: 1,
      pageSize: 10
    });
  }

  search(keyword: string) {
    this.resetSortAndPage();
    this.searchKeyword$.next(keyword || '');
  }

  todoItemStatusChange(status: TodoItemStatusChangeEvent) {
    this.todoListService
      .updateTodoDoneStatus(status.id, status.done)
      .subscribe((item) => {
        this.refresh();
      });
  }

  todoItemDelete(id: string) {
    this.todoListService.deleteTodoItem(id).subscribe(() => {
      this.refresh();
    });
  }
}
