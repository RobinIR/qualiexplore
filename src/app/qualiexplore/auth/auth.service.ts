import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from './user.model';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  userValidFlag = false;
  accessToken: string = null;
  refreshToken: string = null;
  user = new BehaviorSubject<User>(null);
  usernameServer: string = null;
  passwordServer: string = null;
  private tokenExpirationTimer: any;

  constructor(private apollo: Apollo, private router: Router) {}

  isValidUser(username: string, password: string): any {
    const userQuery = gql`
      query {
        users {
          users {
            username
            password
          }
        }
      }
    `;

    return this.apollo.watchQuery({
      query: userQuery,
    }).valueChanges;
  }

  login(username: string, password: string) {
    const authTokenQuery = gql`
      mutation auth($username: String!, $password: String!) {
        login(password: $password, username: $username) {
          accessToken
          refreshToken
        }
      }
    `;

    return this.apollo
      .mutate({
        mutation: authTokenQuery,
        variables: {
          username: username,
          password: password,
        },
      })
      .pipe(
        catchError((errorRes) => {
          let errorMessage = "Error Occured";
          if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
          }
          return throwError(errorRes);
        }),
        tap((result: any) => {
          const accessTokenExpiration = new Date(
            // Token expiration 1 minute
            new Date().getTime() + 60 * 1000
          );
          this.accessToken = result.data.login.accessToken; // Store the access token
          this.refreshToken = result.data.login.refreshToken; // Store the refresh token
          const user = new User(username, this.accessToken, accessTokenExpiration);
          this.user.next(user);
          localStorage.setItem('accessToken', this.accessToken);
          localStorage.setItem('refreshToken', this.refreshToken);
          localStorage.setItem('userData', JSON.stringify(user));
          this.scheduleRefresh(); // Start the session renewal timer
        })
      );
  }

  // Helper method to schedule the session renewal
  public scheduleRefresh() {
    if (!this.accessToken) {
      return;
    }
    
    // Calculate the remaining time until the access token expires
    const expirationDuration =
      new Date(JSON.parse(localStorage.getItem('userData'))._accessTokenExpiration).getTime() -
      new Date().getTime();

    // Set a timer to refresh the session a little before the access token expires
    this.tokenExpirationTimer = setTimeout(() => {
      this.refreshSession();
    }, expirationDuration - 30000); // Renew the session 30 seconds before the token expires
  }

  // Method to refresh the session using the refresh token
  private refreshSession() {
    if (!this.refreshToken) {
      this.logout(); // No refresh token available, so logout the user
      return;
    }

    const REFRESH_MUTATION = gql`
      mutation Refresh($refreshToken: String!) {
        refresh(refreshToken: $refreshToken) {
          newToken
        }
      }
    `;

    this.apollo
      .mutate({
        mutation: REFRESH_MUTATION,
        variables: {
          refreshToken: this.refreshToken,
        },
      })
      .pipe(
        catchError((errorRes) => {
          this.logout(); // If refresh token is invalid or expired, logout the user
          return throwError(errorRes);
        }),
        tap((response: any) => {
          // Update the access token with the new token received from the refresh mutation
          this.accessToken = response.data.refresh.newToken;
          const userData = JSON.parse(localStorage.getItem('userData'));
          if (userData){
            userData._accessToken = this.accessToken;
            // userData._accessTokenExpiration = new Date(
            //   new Date().getTime() + 600 * 1000
            // ).toISOString();
            userData._accessTokenExpiration = new Date(
              new Date().getTime() + 24 * 60 * 60 * 1000 // One day expiration time in milliseconds
            ).toISOString();
            localStorage.setItem('accessToken', this.accessToken);
            localStorage.setItem('userData', JSON.stringify(userData));
            // this.scheduleRefresh(); // Reschedule the session renewal timer with the new access token
          }
        })
      )
      .subscribe();
  }

  // Other methods like isAuth, autoLogin, logout, etc. remain unchanged...

  isAuth(userData: any) {
    if (!userData) {
      return
    }

    const loadedUser = new User(
      userData.username,
      userData._accessToken,
      new Date(userData._accessTokenExpiration),
    ) 

    return loadedUser
  }

  autoLogin() {
    const userData: {
      username: string
      _accessToken: string
      _accessTokenExpiration: string
    } = JSON.parse(localStorage.getItem('userData'))

    const loadedUser = this.isAuth(userData)
    if (loadedUser.token) {
      this.user.next(loadedUser)
      const expirationDuration =
        new Date(userData._accessTokenExpiration).getTime() -
        new Date().getTime()
      // this.autoLogout(expirationDuration)
    }
  }

  logout() {
    this.user.next(null);
    clearTimeout(this.tokenExpirationTimer);
    setTimeout(() => {
      const chatWidgetContainer = document.querySelector('#rasa-chat-widget-container');
      if (chatWidgetContainer) {
        chatWidgetContainer.remove();
      }
    }, 100);
    this.router.navigate(['./qualiexplore/auth'])
    localStorage.removeItem('userData')
    localStorage.removeItem('token')
    sessionStorage.clear()
  }
}
