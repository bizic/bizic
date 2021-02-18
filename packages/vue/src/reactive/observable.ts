/* eslint-disable max-classes-per-file */
import { Service } from 'bizic';

import { makeAutoObserver } from './observe';

export default class Observable extends Service {
  static create<T extends typeof Observable>(this: T, ...args: unknown[]): InstanceType<T> {
    const instance = super.create(...args);
    return makeAutoObserver(instance) as InstanceType<T>;
  }
}
