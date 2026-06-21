import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { Member } from '../../types/member';
import { MemberCard } from '../members/member-card/member-card';
import { PaginatedResult } from '../../types/pagination';
import { Paginator } from '../../shared/paginator/paginator';

@Component({
  selector: 'app-lists',
  imports: [MemberCard, Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
})
export class Lists implements OnInit {
  private likesService = inject(LikesService);
  protected paginatedResult = signal<PaginatedResult<Member> | null>(null);
  protected predicate = 'liked';
  protected pageNumber = 1;
  protected pageSize = 5;

  protected tabs = [
    {label: 'Liked', value: 'liked'},
    {label: 'Liked me', value: 'likedBy'},
    {label: 'Mutual', value: 'mutual'}
  ];

  public ngOnInit(): void {
    this.loadLikes();
  }

  protected setPredicate(predicate: string) {
    if (this.predicate !== predicate) {
      this.predicate = predicate;
      this.pageNumber = 1;
      this.loadLikes();
    }
  }

  private loadLikes() {
    this.likesService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: response => this.paginatedResult.set(response)
    });
  }

  public onPageChange(event: {pageNumber: number, pageSize: number}) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageNumber;
    this.loadLikes();
  }
}
