import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CounterComponent } from './counter/counter.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { rxEffects } from '@rx-angular/state/effects';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  interval,
  map,
  mergeMap,
  tap,
} from 'rxjs';
import { CharacterComponent } from './characters/character/character.component';
import { RxPush } from '@rx-angular/template/push';

@Component({
  standalone: true,
  imports: [CharacterComponent, CounterComponent, ReactiveFormsModule, RxPush],
  selector: 'org-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly input = new FormControl('');
  readonly inputEvent$ = this.input.valueChanges.pipe(
    filter((value) => !!value && value.length > 0),
    debounceTime(500),
    distinctUntilChanged()
  );

  readonly id$ = this.inputEvent$.pipe(
    filter((value) => !isNaN(Number(value))),
    map((value) => Number(value)),
    tap((x) => console.log('id$ tap', x))
  );

  readonly diceTrigger = new Subject<void>();
  readonly dice$ = this.diceTrigger
    .asObservable()
    .pipe(map(() => Math.floor(Math.random() * 10) + 1));
}
