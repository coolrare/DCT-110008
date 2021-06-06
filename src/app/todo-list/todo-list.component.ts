import { TodoItemStatusChangeEvent } from './todo-item-status-change-event';
import { PageChangeEvent } from './page-change-event';
import { SortChangeEvent } from './sort-change-event';
import { TodoListAddDialogComponent } from './todo-list-add-dialog/todo-list-add-dialog.component';
import { TodoListService } from './todo-list.service';
import { TodoItem } from './todo-item';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SortDirection } from './sort-direction';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  suggestList: string[] = [];

  totalCount = 0;
  todoList: TodoItem[] = [];

  keyword = '';
  sortColumn: keyof TodoItem = 'created';
  sortDirection: SortDirection = 'desc';
  pageNumber = 1;
  pageSize = 10;

  constructor(
    private todoListService: TodoListService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.refreshTodoList();
  }

  refreshTodoList() {
    this.todoListService
      .getTodoList(
        this.keyword,
        this.pageNumber,
        this.pageSize,
        this.sortColumn,
        this.sortDirection
      )
      .subscribe((result) => {
        this.totalCount = result.totalCount;
        this.todoList = result.data;
      });
  }

  sortChange(event: SortChangeEvent) {
    this.sortColumn = event.sortColumn;
    this.sortDirection = event.sortDirection;
    this.refreshTodoList();
  }

  pageChange(event: PageChangeEvent) {
    this.pageNumber = event.pageNumber + 1;
    this.pageSize = event.pageSize;
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

  search(keyword: string) {
    this.sortColumn = 'created';
    this.sortDirection = 'desc';
    this.pageNumber = 1;
    this.pageSize = 10;

    this.keyword = keyword;
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
