import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageService } from '../../core/services/message-service';
import { PaginatedResult } from '../../types/pagination';
import { Message } from '../../types/message';
import { Paginator } from '../../shared/paginator/paginator';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ConfirmDialogService } from '../../core/services/confirm-dialog-service';

@Component({
  selector: 'app-messages',
  imports: [Paginator, RouterLink, DatePipe],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit {
  private messageService = inject(MessageService);
  private confirmDialog = inject(ConfirmDialogService);
  protected container = 'Inbox';
  protected fetchedContainer = 'Inbox';
  protected pageNumber = 1;
  protected pageSize = 10;
  protected paginatedMessages = signal<PaginatedResult<Message> | null>(null);
  protected tabs = [
    {label: $localize`:@@inbox:Inbox`, value: 'Inbox'},
    {label: $localize`:@@outbox:Outbox`, value: 'Outbox'},
  ];

  public ngOnInit(): void {
    this.loadMessages();
  }

  private loadMessages() {
    this.messageService.getMessages(this.container, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.paginatedMessages.set(response);
        this.fetchedContainer = this.container;
      }
    });
  }

  public async confirmDelete(event: Event, id: string) {
    event.stopPropagation();
    const ok = await this.confirmDialog.confirm($localize`:@@confirmDeleteMessage:Are you sure you want to delete this message?`);
    if (ok) this.deleteMessage(id);
  }

  public deleteMessage(id: string) {
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        const current = this.paginatedMessages();
        if (current?.items) {
          this.paginatedMessages.update(prev => {
            if (!prev) return null;

            const newItems = prev.items.filter(message => message.id !== id) || [];

            return {
              items: newItems,
              metadata: prev.metadata
            }
          });
        }
      }
    });
  }

  get isInbox(): boolean {
    return this.fetchedContainer === 'Inbox';
  }

  public setContainer(container: string) {
    this.container = container;
    this.pageNumber = 1;
    this.loadMessages();
  }

  public onPageChange(event: {pageNumber: number, pageSize: number}) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageNumber;
    this.loadMessages();
  }
}
