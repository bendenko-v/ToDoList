import { Injectable } from '@angular/core';
import { NativeDateAdapter } from "@angular/material/core";
import { parse } from 'date-fns'

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {

  // @ts-ignore
  parse(value: any): Date | null {
    if (!value) {
      return null;
    }

    return parse(value, 'dd.MM.yyyy', new Date());
  }
}
