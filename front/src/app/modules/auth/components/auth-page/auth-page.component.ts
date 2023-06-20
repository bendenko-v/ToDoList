import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';

enum Tabs {
  auth,
  signUp
}

const TabLinkMap = {
  auth: '/auth',
  signUp: '/auth/sign-up'
}

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent implements OnInit {
  selectedIndex = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    const name = this.activatedRoute.snapshot.children[0].data['name'];
    // @ts-ignore
    this.selectedIndex = Tabs[name];
  }

  onChangeTab(event: MatTabChangeEvent): void {
    const tabName = Tabs[event.index]!
    // @ts-ignore
    const link = TabLinkMap[tabName];
    this.router.navigateByUrl(link);
  }

}
