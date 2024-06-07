import {computed, effect, inject, Injectable, signal} from "@angular/core";
import {User} from "../models/user.model";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { json } from "body-parser";

const USER_STORAGE_KEY = 'user'; //for accept local storage

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #userSignal = signal<User | null>(null);
  user = this.#userSignal.asReadonly();
  isLoggedIn = computed(() => !!this.user());

  http = inject(HttpClient);
  router = inject(Router); //for redirect user after logout

  //for create effect, witch takes user key from local storage
  constructor() {
    //to load user profile from storage
    this.loadUserFromStorage();
    //we will detect when user profile is available
    effect(() => {
      const user = this.user();
      //save user profile to local storage
      if(user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }
    });
  }

  //load user profile from local storage if app will restarted
  loadUserFromStorage() {
    const json = localStorage.getItem(USER_STORAGE_KEY);
    if (json) {
      const user = JSON.parse(json);
      this.#userSignal.set(user);
    }
  }

  async login(email: string, password: string): Promise<User> {
    const login$ = this.http.post<User>(`${environment.apiRoot}/login`,
      {email, password});
    const user = await firstValueFrom(login$);
    this.#userSignal.set(user);
    return user;
  }

  async logout() {
    localStorage.removeItem(USER_STORAGE_KEY);
    this.#userSignal.set(null);
    await this.router.navigateByUrl('/login');
  }
}
