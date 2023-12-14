import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CounterComponent } from './counter/counter.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { rxEffects } from '@rx-angular/state/effects';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  standalone: true,
  imports: [RouterModule, CounterComponent, ReactiveFormsModule],
  selector: 'org-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #router = inject(Router);
  readonly input = new FormControl('');
  readonly inputEvent$ = this.input.valueChanges.pipe(
    filter((value) => !!value && value.length > 0),
    debounceTime(500),
    distinctUntilChanged()
  );

  readonly effects = rxEffects(({ register }) => {
    register(this.inputEvent$, (value) => {
      this.#router.navigate(['character', value]);
    });
  });
}
