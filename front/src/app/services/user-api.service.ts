import { Injectable } from '@angular/core';
import { UpdatePasswordRequest, User, UserData, UserLogin, UserRegistration } from '../models/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  loadProfile(): Observable<User> {
    return this.httpClient.get<User>(environment.apiEndpoint + 'core/profile');
  }

  updateProfile(form: UserData): Observable<User> {
    return this.httpClient.put<User>(environment.apiEndpoint + 'core/profile', form);
  }

  signUp(form: UserRegistration): Observable<User> {
    return this.httpClient.post<User>(environment.apiEndpoint + 'core/signup', form);
  }

  login(form: UserLogin): Observable<User> {
    return this.httpClient.post<User>(environment.apiEndpoint + 'core/login', form);
  }

  logout(): Observable<void> {
    return this.httpClient.delete<void>(environment.apiEndpoint + 'core/profile', {})
  }

  updatePassword(form: UpdatePasswordRequest): Observable<void> {
    return this.httpClient.put<void>(environment.apiEndpoint + 'core/update_password', form);
  }
}
