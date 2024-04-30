import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginCommand } from '../DTO/loginCommand';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { SignupRequestPayload } from '../DTO/SignupRequestPayload';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiServiceUrl=environment.apiBaseUrl;
  httpClient: any;
  httpOption={headers:new HttpHeaders({'Content-type':'application/json'})}


  constructor(private http:HttpClient) { }
  login(loginCommand: LoginCommand): Observable<any> {
    const loginUrl = `${this.apiServiceUrl}/api/v1/auth/authenticate`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<any>(loginUrl, loginCommand, { headers }).pipe(
      tap((response: any) => {
        // Store access_token and refresh_token in local storage
        this.storeAuthTokensInLocalStorage(response);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  private storeAuthTokensInLocalStorage(response: any): void {
    if (response.access_token && response.refresh_token) {
      localStorage.setItem('access_token', (response.access_token));
      localStorage.setItem('refresh_token', (response.refresh_token));
    } else {
      console.error('Access token or refresh token is missing in the response.');
    }
  }
  isLoggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }
    logout(): Observable<void> {
    const logoutUrl = `${this.apiServiceUrl}/logout`;
    const refreshToken = this.getRefreshToken();
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    if (!refreshToken) {
      return throwError('No refresh token found');
    }

    return this.http.post<any>(logoutUrl, { token: refreshToken }, { headers }).pipe(
      catchError(error => {
        return throwError(error);
      }),
      tap(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      })
    );
  }
  private getRefreshToken(){
    return localStorage.getItem('refresh_token');
  }
private decodeToken(token: string): any | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  getUserRoles(): string[] | null {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return null;
    }

    // Decode the access token to extract the payload
    const payload = this.decodeToken(accessToken);
    if (!payload) {
      return null;
    }

    // Extract the roles from the payload
    const roles: string[] = payload.roles;
    return roles;
  }
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
  signup(signupRequestPayload: SignupRequestPayload): Observable<any> {
    console.log(signupRequestPayload)
    return this.http.post<any>(`${this.apiServiceUrl}/api/v1/auth/register`, signupRequestPayload);
  }
  getUsernameFromToken(): string | null {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return null;
    }

    const payload = this.decodeToken(accessToken);
    console.log('Decoded Payload:', payload);

    if (!payload || !payload.sub) {
      return null;
    }

    const username = payload.sub;
    return username;
  }
}
