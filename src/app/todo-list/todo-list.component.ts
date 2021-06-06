import { TodoListService } from './todo-list.service';
import { TodoItem } from './todo-item';
import { Component, OnInit } from '@angular/core';
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

  constructor(private todoListService: TodoListService) {}

  ngOnInit(): void {
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
