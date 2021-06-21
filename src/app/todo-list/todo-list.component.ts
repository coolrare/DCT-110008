import { switchMap, startWith, filter, distinctUntilChanged, debounceTime, map, shareReplay } from 'rxjs/operators';
import { Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TodoItemStatusChangeEvent } from './todo-item-status-change-event';
import { PageChangeEvent } from './page-change-event';
import { SortChangeEvent } from './sort-change-event';
import { TodoListAddDialogComponent } from './todo-list-add-dialog/todo-list-add-dialog.component';
import { TodoListService } from './todo-list.service';
import { TodoItem } from './todo-item';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

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
    switchMap(([keyword, pagination, sort]) => this.todoListService.getTodoList(keyword, pagination, sort)),
    startWith({
      totalCount: 0,
      data: []
    }),
    shareReplay(1)
  );

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
    private todoListService: TodoListService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
  }

  setSuggestList(keyword: string) {
    this.keyword$.next(keyword);
  }

  refreshTodoList() {
    // this.searchKeyword$.next('');
    // this.loading = true;
    // this.todoListService
    //   .getTodoList(
    //     this.keyword,
    //     this.pagination,
    //     this.sort
    //   )
    //   .subscribe({
    //     next: (result) => {
    //       this.totalCount = result.totalCount;
    //       this.todoList = result.data;
    //       this.loading = false;
    //     },
    //     error: (error: HttpErrorResponse) => {
    //       alert(error.error.message);
    //     },
    //   });
  }

  sortChange(event: SortChangeEvent) {
    this.sort$.next(event);
  }

  refresh() {
    this.refreshTodoList();
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
      .subscribe((text) => {
        if (text !== '') {
          this.todoListService.addTodo(text).subscribe((item) => {
            this.refreshTodoList();
          });
        }
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
        this.refreshTodoList();
      });
  }

  todoItemDelete(id: string) {
    this.todoListService.deleteTodoItem(id).subscribe(() => {
      this.refreshTodoList();
    });
  }
}
