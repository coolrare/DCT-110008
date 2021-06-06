import { Pagination } from './pagination';
import { TODO_ITEMS_DATA_SOURCE } from './todo-items-data-source';
import { TodoItem } from './todo-item';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { todoListSearch } from './todo-list-search';
import { SortDirection } from './sort-direction';
import { generate as randomId } from 'shortid';
import { HttpErrorResponse } from '@angular/common/http';

const REQUEST_DELAY = 500;

@Injectable({
  providedIn: 'root',
})
export class TodoListService {
  dataSource = [...TODO_ITEMS_DATA_SOURCE];

  constructor() {}

  /**
   * 取得自動完成建議清單
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

    return of(result).pipe(
      tap(() => console.log('搜尋建議關鍵字', keyword)),
      delay(REQUEST_DELAY),
      tap(() => console.log('搜尋完成'))
    );
  }

  /**
   * 取得待辦事項清單
   */
  getTodoList(
    keyword: string,
    pageNumber: number,
    pageSize: number,
    sortColumn: keyof TodoItem = 'id',
    sortDirection: SortDirection
  ): Observable<Pagination<TodoItem>> {
    if (keyword === 'test') {
      return throwError(
        new HttpErrorResponse({
          error: {
            message: '錯誤: 不可以搜尋 test',
          },
          status: 500,
        })
      ).pipe(delay(1000));
    }
    const result = todoListSearch(
      keyword,
      pageNumber,
      pageSize,
      sortColumn,
      sortDirection,
      this.dataSource
    );

    return of(result).pipe(
      tap(() =>
        console.log('搜尋資料中', {
          keyword,
          pageNumber,
          pageSize,
          sortColumn,
          sortDirection,
        })
      ),
      delay(REQUEST_DELAY),
      tap(() => console.log('搜尋完成'))
    );
  }

  /**
   * 新增待辦事項
   */
  addTodo(text: any) {
    const item = {
      id: randomId(),
      text: text,
      done: false,
      created: new Date().getTime(),
    };

    this.dataSource = [...this.dataSource, item];

    return of(item).pipe(
      tap(() => console.log('新增代辦事項', text)),
      delay(REQUEST_DELAY),
      tap(() => console.log('新增代辦事項完成'))
    );
  }

  /**
   * 更新待辦事項狀態
   */
  updateTodoDoneStatus(id: string, done: boolean) {
    this.dataSource = this.dataSource.reduce((previous, current) => {
      if (current.id === id) {
        return [...previous, { ...current, done }];
      }

      return [...previous, current];
    }, [] as TodoItem[]);

    return of(this.dataSource.find((item) => item.id === id)).pipe(
      tap(() => console.log('更新代辦事項', { id, done })),
      delay(REQUEST_DELAY),
      tap(() => console.log('更新代辦事項完成'))
    );
  }

  /**
   * 刪除待辦事項
   */
  deleteTodoItem(id: string) {
    this.dataSource = this.dataSource.filter((item) => item.id !== id);

    return of(null).pipe(
      tap(() => console.log('移除代辦事項', { id })),
      delay(REQUEST_DELAY),
      tap(() => console.log('移除代辦事項完成'))
    );
  }
}
