import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service';
import { PresenceService } from './presence-service';
import { HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private likesService = inject(LikesService);
  private presenceService = inject(PresenceService);
  public currentUser = signal<User | null>(null);

  public login(creds: LoginCreds) {
    return this.http.post<User>(this.baseUrl + 'account/login', creds, {withCredentials: true}).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
          this.startTokenRefreshInterval();
        }
      })
    );
  }

  public register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', creds, {withCredentials: true}).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
          this.startTokenRefreshInterval();
        }
      })
    );
  }

  public refreshToken() {
    // cookies are automatically sent up with the request when we use {withCredentials: true}
    return this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, {withCredentials: true});
  }

  public startTokenRefreshInterval() {
    setInterval(() => {
      this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, {withCredentials: true}).subscribe({
        next: user => {
          this.setCurrentUser(user);
        },
        error: () => {
          this.logout()
        }
      });
    }, 5 * 60 * 10000);
  }

  public setCurrentUser(user: User) {
    user.roles = this.getRolesFromToken(user);
    this.currentUser.set(user);
    this.likesService.getLikeIds();
    if (this.presenceService.hubConnection?.state !== HubConnectionState.Connected) {
      this.presenceService.createHubConnection(user);
    }
  }

  public logout() {
    this.http.post(this.baseUrl + 'account/logout', {}, {withCredentials: true}).subscribe({
      next: () => {
        localStorage.removeItem('filters');
        this.likesService.clearLikeIds();
        this.currentUser.set(null);
        this.presenceService.stopHubConnection();
      }
    });
  }

  private getRolesFromToken(user: User): string[] {
    const payload = user.token.split('.')[1];
    const decoded = atob(payload);
    const jsonPayload = JSON.parse(decoded);
    return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role];
  }
}
