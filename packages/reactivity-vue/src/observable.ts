/* eslint-disable max-classes-per-file */

import { Service } from 'bizic';

import { observable, shallowObservable } from './observe';

export class Observable extends Service {
  static create<T extends typeof Observable>(this: T, ...args: unknown[]): InstanceType<T> {
    const instance = super.create(...args);
    return observable(instance) as InstanceType<T>;
  }
}
export class ShallowObservable extends Service {
  static create<T extends typeof Observable>(this: T, ...args: unknown[]): InstanceType<T> {
    const instance = super.create(...args);
    return shallowObservable(instance) as InstanceType<T>;
  }
}
