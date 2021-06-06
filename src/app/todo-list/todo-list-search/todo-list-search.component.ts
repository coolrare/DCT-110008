import { TodoListService } from './../todo-list.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TodoItem } from '../todo-item';

@Component({
  selector: 'app-todo-list-search',
  templateUrl: './todo-list-search.component.html',
  styleUrls: ['./todo-list-search.component.css'],
})
export class TodoListSearchComponent implements OnInit {
  @Output() keywordChange = new EventEmitter<string>();

  keywordControl = new FormControl();

  suggestList: string[] = [];

  constructor(private todoListService: TodoListService) {}

  ngOnInit(): void {
    this.keywordControl.valueChanges.subscribe((keyword) => {
      this.todoListService.getSuggestList(keyword).subscribe((result) => {
        this.suggestList = result;
      });
    });
  }

  search() {
    this.keywordChange.emit(this.keywordControl.value);
  }
}
