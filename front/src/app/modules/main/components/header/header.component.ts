import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { getInitials } from 'src/app/modules/shared/helpers/get-initials';
import { UserService } from "../../../../services/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() isOpenedPanel = false;
  @Output() togglePanel = new EventEmitter<void>();

  user$ = this.userService.user$;

  getInitials = getInitials;

  constructor(
    private userService: UserService,
  ) {
  }

  onTogglePanel(): void {
    this.togglePanel.emit();
  }

}
