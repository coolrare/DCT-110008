import {
  tap,
  startWith,
  switchMap,
  map,
  filter,
  debounceTime,
  distinctUntilChanged,
  shareReplay,
} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TodoItemStatusChangeEvent } from './todo-item-status-change-event';
import { PageChangeEvent } from './page-change-event';
import { SortChangeEvent } from './sort-change-event';
import { TodoListAddDialogComponent } from './todo-list-add-dialog/todo-list-add-dialog.component';
import { TodoListService } from './todo-list.service';
import { TodoItem } from './todo-item';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Observable,
  of,
  Subscription,
  timer,
  Subject,
  BehaviorSubject,
  combineLatest,
} from 'rxjs';
import { Pagination } from './pagination';
import { FormBuilder, FormControl } from '@angular/forms';

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
    sortDirection: 'desc',
  };
  pagination: PageChangeEvent = {
    pageNumber: 1,
    pageSize: 10,
  };

  loading = false;


  items$!: Observable<TodoItem[]>;
  // counter = 0;

  counter$ = timer(0, 1000)
    .pipe
    // tap(data => console.log(data))
    ();

  keyword$ = new Subject<string>();
  searchByKeyword$ = new BehaviorSubject('');
  sort$ = new BehaviorSubject<SortChangeEvent>({
    sortColumn: 'created',
    sortDirection: 'desc',
  });
  pagination$ = new BehaviorSubject<PageChangeEvent>({
    pageNumber: 1,
    pageSize: 10,
  });

  suggestList$ = this.keyword$.pipe(
    filter((keyword) => keyword.length >= 3),
    debounceTime(1000),
    distinctUntilChanged(),
    switchMap((keyword) => this.todoListService.getSuggestList(keyword)),
    startWith([])
  );

  todoList$ = combineLatest([this.searchByKeyword$, this.sort$, this.pagination$])
    .pipe(
      debounceTime(0),
      switchMap(([keyword, sort, pagination]) => this.todoListService.getTodoList(keyword, pagination, sort)),
      startWith({
        totalCount: 0,
        data: []
      }),
      shareReplay(1)
    );

  constructor(
    private todoListService: TodoListService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnChanges() {}

  ngOnInit(): void {
    // var control = this.fb.control('');

    // control.valueChanges
    //   .pipe(
    //     switchMap(() => timer(0, 1000))
    //   )
    //   .subscribe(result => {
    //     console.log(result);
    //   });

    const s = timer(0, 1000).subscribe((data) => {
      // console.log(data);
      // this.counter = data;
    });

    this.sub.add(s);

    // this.refreshTodoList();
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
    this.todoList$ = this.todoListService
      .getTodoList(this.keyword, this.pagination, this.sort)
      .pipe(
        startWith({
          totalCount: 0,
          data: [],
        })
      );

    this.items$ = this.todoList$.pipe(map((result) => result.data));
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
    // this.sort = { ...event };
    // this.refreshTodoList();
    this.sort$.next({ ...event });
  }

  refresh() {
    this.refreshTodoList();
  }

  pageChange(event: PageChangeEvent) {
    // this.pagination = {
    //   pageNumber: event.pageNumber + 1,
    //   pageSize : event.pageSize
    // };
    // this.refreshTodoList();
    this.pagination$.next({
      pageNumber: event.pageNumber + 1,
      pageSize: event.pageSize,
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
    this.sort = {
      sortColumn: 'created',
      sortDirection: 'desc',
    };

    this.pagination = {
      pageNumber: 1,
      pageSize: 10,
    };
  }

  search(keyword: string) {
    // this.keyword = keyword;
    // this.resetSortAndPage();
    // this.refreshTodoList();
    this.searchByKeyword$.next(keyword);
    this.sort$.next( {
      sortColumn: 'created',
      sortDirection: 'desc',
    });
    this.pagination$.next({
      pageNumber: 1,
      pageSize: 10,
    });
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
