import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxState } from '@rx-angular/state';
import { RxLet } from '@rx-angular/template/let';
import { Subject } from 'rxjs';

@Component({
  selector: 'org-counter',
  standalone: true,
  imports: [CommonModule, RxLet],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent {
  private readonly increment$$ = new Subject<void>();
  private readonly state = rxState<{ count: number }>(({ set, connect }) => {
    set({ count: 0 });
    connect(this.increment$$, ({ count }) => ({ count: count + 1 }));
  });

  readonly count$ = this.state.select('count');

  increment() {
    this.increment$$.next();
  }

}
