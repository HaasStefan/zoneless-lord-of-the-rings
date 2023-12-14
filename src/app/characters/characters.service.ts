import { Injectable, inject } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { rxActions } from '@rx-angular/state/actions';
import { rxEffects } from '@rx-angular/state/effects';
import { CharacterDataService } from './character-data.service';
import { Character } from './character.model';
import { exhaustMap, of, pipe } from 'rxjs';

interface State {
  characters: Record<number, Character>;
}

const initialState: State = {
  characters: {},
} as const;

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  readonly #dataService = inject(CharacterDataService);

  readonly actions = rxActions<{ loadCharacter: { id: number } }>();
  readonly #state = rxState<State>(({ set, connect }) => {
    set(initialState);
    connect(
      'characters',
      this.actions.loadCharacter$.pipe(
        exhaustMap(({ id }) =>
          this.#state.get('characters')[id]
            ? of(this.#state.get('characters')[id])
            : this.#dataService.getById(id)
        )
      ),
      (state, character) => ({
        ...state.characters,
        [character.id]: character,
      })
    );
  });

  readonly effects = rxEffects(({ register }) => {
    register(this.actions.loadCharacter$, ({ id }) => {
      console.log(this.#state.get('characters'));
      console.log(`Loading character ${id}...`);
    });
  });

  readonly characters$ = this.#state.select('characters');
}
