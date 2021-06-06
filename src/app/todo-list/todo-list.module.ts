import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TodoListRoutingModule } from './todo-list-routing.module';
import { TodoListTableComponent } from './todo-list-table/todo-list-table.component';
import { TodoListComponent } from './todo-list.component';
import { TodoListSearchComponent } from './todo-list-search/todo-list-search.component';

@NgModule({
  declarations: [TodoListComponent, TodoListTableComponent, TodoListSearchComponent],
  imports: [
    CommonModule,
    TodoListRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule
  ],
})
export class TodoListModule {}
