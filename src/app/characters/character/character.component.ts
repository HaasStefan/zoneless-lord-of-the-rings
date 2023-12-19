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
import { Observable, filter, map, withLatestFrom } from 'rxjs';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';

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
  imports: [CommonModule, RxIf, RxFor],
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterComponent {
  readonly charactersState = inject(CharactersService);

  @Input() set id(id$: Observable<number>) {
    this.state.connect('id', id$);
  }

  readonly state = rxState<State>(({ set, connect, select }) => {
    set(initialState);
    connect(
      'character',
      this.charactersState.characters$.pipe(
        withLatestFrom(select('id')),
        filter(
          (combined): combined is [Record<number, Character>, number] =>
            combined[1] !== null
        ),
        map(([characters, id]) => characters[id] ?? null)
      )
    );
  });

  readonly effects = rxEffects(({ register }) => {
    register(this.state.select('id'), (id) => {
      if (id !== null) {
        this.charactersState.actions.loadCharacter({ id });
      }
    });
  });

  readonly character$ = this.state
    .select('character')
    .pipe(
      filter(
        (character): character is NonNullable<typeof character> => !!character
      )
    );
}
