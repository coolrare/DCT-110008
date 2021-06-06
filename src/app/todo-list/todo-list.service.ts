import { Pagination } from './pagination';
import { TODO_ITEMS_DATA_SOURCE } from './todo-items-data-source';
import { TodoItem } from './todo-item';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { todoListSearch } from './todo-list-search';
import { SortDirection } from './sort-direction';
import { generate as randomId } from 'shortid';

@Injectable({
  providedIn: 'root',
})
export class TodoListService {
  dataSource = [...TODO_ITEMS_DATA_SOURCE];

  constructor() {}

  /**
   * 取得自動完成建議清單
   *
   * @param keyword 關鍵字
   * @returns
   */
  getSuggestList(keyword: string, fetchCount = 10): Observable<string[]> {
    const result = [];

    for (let i = 0; i < this.dataSource.length; ++i) {
      const item = this.dataSource[i];

      if (item.text.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
        result.push(item.text);
      }

      if (result.length >= fetchCount) {
        break;
      }
    }

    return of(result).pipe(delay(100));
  }

  getTodoList(
    keyword: string,
    pageNumber: number,
    pageSize: number,
    sortColumn: keyof TodoItem = 'id',
    sortDirection: SortDirection
  ): Observable<Pagination<TodoItem>> {
    const result = todoListSearch(
      keyword,
      pageNumber,
      pageSize,
      sortColumn,
      sortDirection,
      this.dataSource
    );

    return of(result).pipe(delay(100));
  }

  addTodo(text: any) {
    const item = {
      id: randomId(),
      text: text,
      done: false,
      created: new Date().getTime(),
    };

    this.dataSource = [...this.dataSource, item];

    return of(item).pipe(delay(100));
  }
}
