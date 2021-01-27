import { strict as assert } from 'assert';
import { isReactive } from 'vue';
import Observable from '../../src/reactive/observable';

describe('vue/src/reactive/observable.ts', () => {
  it('Observable should be ok', () => {
    const m = Observable.create();
    assert(isReactive(m));
  });
});
