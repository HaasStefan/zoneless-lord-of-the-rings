import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_BASE_URL } from '../shared/tokens.util';
import { Character } from './character.model';

@Injectable({
  providedIn: 'root',
})
export class CharacterDataService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = inject(API_BASE_URL);

  getById(id: number) {
    return this.#http.get<Character>(`${this.#baseUrl}/characters/${id}`);
  }
}
