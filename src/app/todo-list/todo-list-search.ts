import {
  ascend,
  descend,
  equals,
  filter,
  ifElse,
  includes,
  isEmpty,
  length,
  pipe,
  prop,
  sort,
  take,
  takeLast,
  toLower
} from 'ramda';
import { Pagination } from './pagination';
import { SortDirection } from './sort-direction';
import { TodoItem } from './todo-item';

export const todoListSearch = (
  keyword: string,
  pageNumber: number,
  pageSize: number,
  sortColumn: keyof TodoItem,
  sortDirection: SortDirection,
  dataSource: TodoItem[]
): Pagination<TodoItem> => {
  // 篩選
  const getTextColumnData = prop<'text', string>('text');
  const hasKeyword = includes(keyword);
  const filterByKeyword = ifElse(
    () => isEmpty(keyword),
    () => true,
    pipe(getTextColumnData, toLower, hasKeyword)
  );
  const filterFn = filter<TodoItem>(filterByKeyword);

  // 排序
  const getSortColumn = prop<string>(sortColumn);
  const comparator = ifElse(
    () => equals('asc', sortDirection),
    ascend<TodoItem>(getSortColumn),
    descend<TodoItem>(getSortColumn)
  );
  const sortFn = sort<TodoItem>(comparator);

  // 分頁
  const paginationFn = pipe<TodoItem[], TodoItem[], TodoItem[]>(
    take(pageNumber * pageSize),
    takeLast(pageSize)
  );

  // 組合所有 functions
  const fn = pipe<TodoItem[], TodoItem[], TodoItem[]>(sortFn, paginationFn);

  return {
    totalCount: length(filterFn(dataSource)),
    data: fn(dataSource),
  };
};
