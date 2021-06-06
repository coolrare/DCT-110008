import { Pagination } from './pagination';
import { TODO_ITEMS_DATA_SOURCE } from './todo-items-data-source';
import { TodoItem } from './todo-item';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { todoListSearch } from './todo-list-search';
import { SortDirection } from './sort-direction';

@Injectable({
  providedIn: 'root',
})
export class TodoListService {
  constructor() {}

  /**
   * 取得自動完成建議清單
   *
   * @param keyword 關鍵字
   * @returns
   */
  getSuggestList(keyword: string, fetchCount = 10): Observable<string[]> {
    const result = [];

    for (let i = 0; i < TODO_ITEMS_DATA_SOURCE.length; ++i) {
      const item = TODO_ITEMS_DATA_SOURCE[i];

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
      TODO_ITEMS_DATA_SOURCE
    );

    return of(result).pipe(delay(100));
  }
}
