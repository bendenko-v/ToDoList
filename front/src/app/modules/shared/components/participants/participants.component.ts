import { ChangeDetectionStrategy, Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Participant, ParticipantRole } from "../../../../models/user";
import { BehaviorSubject, map, merge, Observable, skip, Subject, takeUntil } from "rxjs";
import { Entity } from "../../../../models/base";

type onChange = (value: Participant[]) => void;

class ViewParticipant implements Participant {
  userControl: FormControl;
  roleControl: FormControl;
  role: ParticipantRole;
  user: string;

  constructor(
    item: Participant,
    destroy$: Observable<void>,
    update: () => void,
  ) {
    this.userControl = new FormControl(item.user);
    this.roleControl = new FormControl(item.role);
    this.role = item.role;
    this.user = item.user;

    this.roleControl.valueChanges.pipe(
      takeUntil(destroy$)
    ).subscribe(value => {
      item.role = value;
      update();
    });
    this.userControl.valueChanges.pipe(
      takeUntil(destroy$)
    ).subscribe(value => {
      item.user = value;
      update();
    });
  }
}

const ROLES_LIST: Entity[] = [
  {
    id: ParticipantRole.write,
    title: 'Редактор'
  },
  {
    id: ParticipantRole.read,
    title: 'Читатель'
  }
];

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ParticipantsComponent),
      multi: true
    },
  ],
})
export class ParticipantsComponent implements ControlValueAccessor, OnInit {
  private list$ = new BehaviorSubject<Participant[]>([]);
  private destroy$ = new Subject<void>();

  viewList$: Observable<ViewParticipant[]>
  roleList: Entity[] = ROLES_LIST;
  Role = ParticipantRole;

  private onChange?: onChange;

  ngOnInit(): void {
    const destroy$ = merge(
      this.destroy$,
      this.list$.pipe(skip(1))
    ).pipe(map(() => {}));
    this.viewList$ = this.list$.pipe(
      map(list => list.map(item => new ViewParticipant(
        item,
        destroy$,
        this.update.bind(this)
      )))
    );
  }

  remove(index: number): void {
    const list = this.list$.getValue();
    list.splice(index, 1);
    this.list$.next(list);
    this.update();
  }

  writeValue(list: Participant[]): void {
    this.list$.next(this.clearValue(list));
  }

  add(): void {
    this.list$.next([
      ...this.list$.getValue(),
      {
        user: '',
        role: ParticipantRole.read,
      }
    ]);
    this.update();
  }

  registerOnChange(fn: onChange): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  private update(): void {
    if (this.onChange) {
      this.onChange(
        this.clearValue(this.list$.getValue())
      );
    }
  }

  private clearValue(list: Participant[]): Participant[] {
    return list.map(item => ({ role: item.role, user: item.user }));
  }

}
