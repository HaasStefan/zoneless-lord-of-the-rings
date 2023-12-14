import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharactersService } from '../characters.service';
import { rxState } from '@rx-angular/state';
import { Character } from '../character.model';
import { rxEffects } from '@rx-angular/state/effects';
import { Subject, combineLatest, filter, map, share, shareReplay, tap } from 'rxjs';
import { RxLet } from '@rx-angular/template/let';
import { ActivatedRoute } from '@angular/router';

interface State {
  id: number | null;
  character: Character | null;
}

const initialState: State = {
  id: null,
  character: null,
} as const;

@Component({
  selector: 'org-character',
  standalone: true,
  imports: [CommonModule, RxLet],
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterComponent {
  readonly charactersState = inject(CharactersService);
  readonly #route = inject(ActivatedRoute);
  readonly id$ = this.#route.params.pipe(
    map(({ id }) => parseInt(id, 10)),
    filter((id): id is number => !isNaN(id)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly #state = rxState<State>(({ set, connect }) => {
    set(initialState);
    connect('id', this.id$);
    connect(
      'character',
      combineLatest({
        characters: this.charactersState.characters$,
        id: this.id$,
      }).pipe(
        filter(
          (
            combined
          ): combined is {
            characters: typeof combined.characters;
            id: number;
          } => combined.id !== null
        ),
        map(({ characters, id }) => characters[id] ?? null),
        tap(console.warn),
      )
    );
  });

  readonly #effects = rxEffects(({ register }) => {
    register(this.#state.select('id'), (id) => {
      if (id !== null) {
        this.charactersState.actions.loadCharacter({ id });
      }
    });

    register(this.#state.select('character'), (character) => {
      console.log("character: ", character);
    });
  });

  readonly character$ = this.#state.select('character');
}
