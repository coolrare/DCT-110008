import { TodoItem } from './../todo-item';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-todo-list-table',
  templateUrl: './todo-list-table.component.html',
  styleUrls: ['./todo-list-table.component.css'],
})
export class TodoListTableComponent implements OnInit {
  @Input() todoList: TodoItem[] = [];
  @Input() totalCount = 0;

  @Output() sortChange = new EventEmitter<{
    sortColumn: string;
    sortDirection: string;
  }>();

  @Output() pageChange = new EventEmitter<{
    pageNumber: number;
    pageSize: number;
  }>();

  displayedColumns = ['id', 'done', 'text', 'created', 'action'];

  constructor() {}

  ngOnInit(): void {}

  sort(sortData: Sort) {
    this.sortChange.emit({
      sortColumn: sortData.active,
      sortDirection: sortData.direction
    });
  }

  page(pageEvent: PageEvent){
    this.pageChange.emit({
      pageNumber: pageEvent.pageIndex,
      pageSize: pageEvent.pageSize
    });
  }
}
