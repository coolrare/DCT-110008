import { TodoListAddDialogComponent } from './todo-list-add-dialog/todo-list-add-dialog.component';
import { TodoListService } from './todo-list.service';
import { TodoItem } from './todo-item';
import { Component, OnInit } from '@angular/core';
import { SortDirection } from './sort-direction';
import { MatDialog } from '@angular/material/dialog';

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

  displayTodoDialog() {
    this.dialog
      .open(TodoListAddDialogComponent)
      .afterClosed()
      .subscribe((text) => {
        if (text !== '') {
          this.todoListService.addTodo(text).subscribe(() => {
            this.refreshTodoList();
          });
        }
      });
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
}
