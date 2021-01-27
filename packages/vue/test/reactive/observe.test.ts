/* eslint-disable max-classes-per-file */
import { strict as assert } from 'assert';
import { isReactive, watch } from 'vue';
import {
  makeObserver, makeAutoObserver, getAutoObserverAnnotationMap, AnnotationType
} from '../../src/reactive/observe';

describe('vue/src/reactive/observe.ts', () => {
  it('makeObserver should be ok with observable', (cb) => {
    const data: { n: number; m: number } = {
      n: 1,
      m: 2,
    };
    const observedData = makeObserver(data, { n: AnnotationType.OBSERVABLE });
    watch(() => observedData.m, () => {
      assert.fail('should not trigger when update unreactived value');
    });
    observedData.m++;
    watch(() => observedData.n, () => {
      assert.equal(observedData.n, 2);
      cb();
    });
    observedData.n++;
    assert(isReactive(observedData));
  });

  it('makeObserver should be ok with observable when delete property', (cb) => {
    const data: { n?: number; m?: number } = {
      n: 1,
      m: 2,
    };
    const observedData = makeObserver(data, { n: AnnotationType.OBSERVABLE });

    watch(() => observedData.m, () => {
      assert.fail('should not trigger when delete unreactived value');
    });
    delete observedData.m;
    watch(() => observedData.n, () => {
      assert.equal(observedData.n, undefined);
      cb();
    });
    delete observedData.n;
  });

  it('makeObserver should be ok with computed', () => {
    let shouldNotTriggerGetter = false;
    class Test {
      m = 0;

      get n() {
        assert(!shouldNotTriggerGetter, 'should not trigger getter');
        return this.m + 1;
      }
    }
    const data = new Test();
    const observedData = makeObserver(data, { n: AnnotationType.COMPUTED, m: AnnotationType.OBSERVABLE });
    shouldNotTriggerGetter = false;
    assert.equal(observedData.n, 1);
    shouldNotTriggerGetter = true;
    assert.equal(observedData.n, 1);

    observedData.m = 2;
    shouldNotTriggerGetter = false;
    assert.equal(observedData.n, 3);
  });

  it('getAutoObserverAnnotationMap should be ok', () => {
    class Test {
      m = 0;

      get n() {
        return this.m + 1;
      }

      test() {

      }
    }
    const t = new Test();
    const annotationMap = getAutoObserverAnnotationMap(t);
    assert.equal(annotationMap.m, AnnotationType.OBSERVABLE);
    assert.equal(annotationMap.n, AnnotationType.COMPUTED);
    assert.equal(annotationMap.test, undefined);
  });
  it('makeAutoObserver should be ok', () => {
    const observed = makeAutoObserver({ n: 2 });
    assert(isReactive(observed));
  });
});
