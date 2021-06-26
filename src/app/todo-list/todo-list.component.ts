import { tap, startWith, switchMap, map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TodoItemStatusChangeEvent } from './todo-item-status-change-event';
import { PageChangeEvent } from './page-change-event';
import { SortChangeEvent } from './sort-change-event';
import { TodoListAddDialogComponent } from './todo-list-add-dialog/todo-list-add-dialog.component';
import { TodoListService } from './todo-list.service';
import { TodoItem } from './todo-item';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, Subscription, timer, Subject } from 'rxjs';
import { Pagination } from './pagination';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  sub = new Subscription();

  @Input() data = [];

  suggestList: string[] = [];

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

  todoList$!: Observable<Pagination<TodoItem>>;
  items$!: Observable<TodoItem[]>;
  // counter = 0;

  counter$ = timer(0, 1000).pipe(
    // tap(data => console.log(data))
  );

  keyword$ = new Subject<string>();
  suggestList$ = this.keyword$.pipe(
    filter(keyword => keyword.length >= 3),
    debounceTime(1000),
    distinctUntilChanged(),
    switchMap(keyword => this.todoListService.getSuggestList(keyword)),
    startWith([])
  );


  constructor(
    private todoListService: TodoListService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
  }

  ngOnChanges() {

  }

  ngOnInit(): void {
    // var control = this.fb.control('');

    // control.valueChanges
    //   .pipe(
    //     switchMap(() => timer(0, 1000))
    //   )
    //   .subscribe(result => {
    //     console.log(result);
    //   });

    const s = timer(0, 1000).subscribe(data => {
      // console.log(data);
      // this.counter = data;
    });

    this.sub.add(s);

    this.refreshTodoList();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  setSuggestList(keyword: string) {
    this.keyword$.next(keyword);
    // this.todoListService.getSuggestList(keyword).subscribe((result) => {
    //   this.suggestList = result;
    // });
  }

  refreshTodoList() {
    this.todoList$ =
      this.todoListService
        .getTodoList(
          this.keyword,
          this.pagination,
          this.sort
        )
        .pipe(
          startWith({
            totalCount: 0,
            data: []
          })
        );

    this.items$ = this.todoList$.pipe(
      map(result => result.data)
    );
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
    this.sort = { ...event };
    this.refreshTodoList();
  }

  refresh() {
    this.refreshTodoList();
  }

  pageChange(event: PageChangeEvent) {
    this.pagination = {
      pageNumber: event.pageNumber + 1,
      pageSize : event.pageSize
    };
    this.refreshTodoList();
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
    this.sort = {
      sortColumn: 'created',
      sortDirection: 'desc'
    };

    this.pagination = {
      pageNumber: 1,
      pageSize: 10
    };
  }

  search(keyword: string) {
    this.keyword = keyword;
    this.resetSortAndPage();
    this.refreshTodoList();
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
