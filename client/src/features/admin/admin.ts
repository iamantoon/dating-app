import { Component, inject } from '@angular/core';
import { AccountService } from '../../core/services/account-service';
import { UserManagement } from './user-management/user-management';
import { PhotoManagement } from './photo-management/photo-management';

@Component({
  selector: 'app-admin',
  imports: [UserManagement, PhotoManagement],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  public accountService = inject(AccountService);
  public activeTab = 'photos';
  public tabs = [
    {label: 'Photo moderation', value: 'photos'},
    {label: 'User management', value: 'roles'}
  ];

  public setTab(tab: string) {
    this.activeTab = tab;
  }
}
