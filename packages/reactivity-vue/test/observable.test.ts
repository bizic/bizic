import { strict as assert } from 'assert';
import { isReactive } from '@vue/reactivity';
import { Observable, ShallowObservable } from '../src/observable';

describe('reactivity-vue/src/observable.ts', () => {
  it('Observable should be ok', () => {
    const m = Observable.create();
    assert(isReactive(m));
  });
  it('ShallowObservable should be ok', () => {
    const m = ShallowObservable.create();
    assert(isReactive(m));
  });
});
