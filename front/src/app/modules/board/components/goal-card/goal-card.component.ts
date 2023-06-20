import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { Goal } from "../../../../models/goal";
import { differenceInDays } from "date-fns";

@Component({
  selector: 'app-goal-card',
  templateUrl: './goal-card.component.html',
  styleUrls: ['./goal-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalCardComponent implements OnChanges {
  @Input() goal!: Goal;
  @Input() priorityMap!: Record<number, string>;

  @Output() editGoal = new EventEmitter<DOMRect>();

  isOutDate = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['goal']) {
      this.isOutDate = this.checkIsOutDate();
    }
  }

  onEditGoal(button: any, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const doomRect = button._elementRef.nativeElement.getBoundingClientRect();
    this.editGoal.emit(doomRect);
  }

  private checkIsOutDate(): boolean {
    if (!this.goal.due_date) {
      return false;
    }

    return differenceInDays(new Date(), new Date(this.goal.due_date)) > 1;
  }
}
