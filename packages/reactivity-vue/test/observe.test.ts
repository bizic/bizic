/* eslint-disable max-classes-per-file */
import { strict as assert } from 'assert';
import { isReactive, watch } from 'vue';
import {
  getGetterMap,
  observable
} from '../src/observe';

describe('reactivity-vue/src/observe.ts', () => {
  it('observable should be ok with observable', (cb) => {
    const data: { n: number } = {
      n: 1,
    };
    const observedData = observable(data);
    watch(() => observedData.n, () => {
      assert.equal(observedData.n, 2);
      cb();
    });
    observedData.n++;
    assert(isReactive(observedData));
    assert.equal(observable(1), 1);
  });

  it('makeObserver should be ok with computed', () => {
    let shouldNotTriggerGetter = false;
    class Test {
      m = 0;

      get n() {
        assert(!shouldNotTriggerGetter, 'should not trigger getter');
        return { key: this.m + 1 };
      }
    }
    const data = new Test();
    const observedData = observable(data);
    shouldNotTriggerGetter = false;

    assert.equal(observedData.n.key, 1);
    shouldNotTriggerGetter = true;
    assert.equal(observedData.n.key, 1);

    observedData.m = 2;
    shouldNotTriggerGetter = false;
    assert.equal(observedData.n.key, 3);
  });

  it('getGetterMao should be ok', () => {
    assert.equal(getGetterMap({ n: 1 }), null);
    assert.equal(getGetterMap(new Map()), null);
    assert.equal(getGetterMap(Object.create(null)), null);
    assert.equal(getGetterMap([]), null);

    class Test {
      m = 0;

      get n() {
        return { key: this.m + 1 };
      }
    }
    const t = new Test();
    const getters = getGetterMap(t);
    assert(getters);
    assert.equal(getters.n, true);
  });
});
