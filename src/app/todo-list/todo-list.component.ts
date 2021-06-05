import { TodoListService } from './todo-list.service';
import { TodoItem } from './todo-item';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  keyword = new FormControl();

  suggestList: TodoItem[] = [];

  constructor(private todoListService: TodoListService) {}

  ngOnInit(): void {
    this.keyword.valueChanges.subscribe((keyword) => {
      this.suggestList = this.todoListService.getSuggestList(keyword);
    });
  }
}
