import { Route } from "@angular/router";
import { Observable } from "rxjs";
import { Injector } from "@angular/core";

export interface StaticMenu extends Route {
  name: string;
}

export interface DynamicMenu extends Route {
  getName: (injector: Injector) => Observable<string | null>;
  getPath: (injector: Injector) => Observable<string | null>;
}

export interface MenuSeparator {
  isSeparator: true;
}

export type MenuView = Menu | MenuSeparator;

export type Menu = StaticMenu | DynamicMenu;
