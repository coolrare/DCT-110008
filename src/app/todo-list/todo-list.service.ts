import { TODO_ITEMS_DATA_SOURCE } from './todo-items-data-source';
import { TodoItem } from './todo-item';
import { Injectable } from '@angular/core';

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
  getSuggestList(keyword: string, fetchCount = 10) {
    const result = [];

    for (let i = 0; i < TODO_ITEMS_DATA_SOURCE.length; ++i) {
      const item = TODO_ITEMS_DATA_SOURCE[i];

      if (item.text.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
        result.push(item);
      }

      if (result.length >= fetchCount) {
        break;
      }
    }

    return result;
  }
}
