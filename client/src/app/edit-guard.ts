import { CanDeactivate } from '@angular/router';
import { Injectable, Component } from '@angular/core';

@Injectable()
export class EditGuard implements CanDeactivate<Component> {

  canDeactivate(component: Component) {
    return confirm('Are you sure you want to leave?');
  }

}