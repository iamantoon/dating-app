import { Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
})
export class Paginator {
  public pageNumber = model(1);
  public pageSize = model(10);
  public totalCount = input(0);
  public totalPages = input(0);
  public pageSizeOptions = input([5, 10, 20, 50]);
  public pageChange = output<{pageNumber: number, pageSize: number}>();
  public lastItemIndex = computed(() => {
    return Math.min(this.pageNumber() * this.pageSize(), this.totalCount());
  });

  public onPageChange(newPage?: number, pageSize?: EventTarget | null) {
    if (newPage) this.pageNumber.set(newPage);
    if (pageSize) {
      const size = Number((pageSize as HTMLSelectElement).value);
      this.pageSize.set(size);
    }

    this.pageChange.emit({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize()
    });
  }
}
