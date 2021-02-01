import { strict as assert } from 'assert';
import { h, inject, defineComponent } from 'vue';
import SaxonyCore from 'saxony';

import {
  SAXONY_CORE_KEY, PROVIDER_KEY, RootProvider
} from '../src/components';
import { createApp, nodeOps } from './vueTestUtils';

import { withRootProvider, withScopedProvider, withComponentFactory } from '../src/hoc';

describe('vue/src/hoc.ts', () => {
  it('withComponentFactory', (cb) => {
    const testProps = 'props';

    interface TestCommentProps {
      test?: string;
    }
    const TestComponent = defineComponent({
      props: {
        test: String,
      },
      setup(props: TestCommentProps, ctx) {
        assert.equal(props.test, testProps);
        return () => h('div', ctx.slots.default?.());
      },
    });
    interface TestSubCommentProps {
      testSub?: string;
    }
    const TestSub = defineComponent({
      props: {
        testSub: String,
      },
      setup(props: TestSubCommentProps, ctx) {
        assert.equal(props.testSub, 'tetSub');
        assert.equal(ctx.attrs.class, '.test');
        cb();
        return () => h('div', ctx.slots.default?.());
      },
    });
    const hoc = withComponentFactory(TestComponent, { test: testProps })(TestSub);
    const instance = createApp({
      setup() {
        return () => h(hoc, { testSub: 'tetSub', class: '.test' });
      },
    });
    const root = nodeOps.createElement('div');
    instance.mount(root);
  });

  it('withRootProvider should be ok', (cb) => {
    const saxony = new SaxonyCore();

    const TestComponent = defineComponent({
      setup() {
        assert.equal(saxony, inject(SAXONY_CORE_KEY));
        assert(inject(PROVIDER_KEY));
        cb();
        return () => h('div');
      },
    });
    const instance = createApp({
      setup() {
        return () => h(withRootProvider(TestComponent, saxony));
      },
    });
    const root = nodeOps.createElement('div');
    instance.mount(root);
  });

  it('withScopedProvider should be ok', (cb) => {
    const saxony = new SaxonyCore();

    const TestComponent = defineComponent({
      setup() {
        assert.equal(saxony, inject(SAXONY_CORE_KEY));
        assert(inject(PROVIDER_KEY));
        cb();
        return () => h('div');
      },
    });
    const instance = createApp({
      setup() {
        return () => h(RootProvider, { saxony }, () => h(withScopedProvider(TestComponent, '11')));
      },
    });
    const root = nodeOps.createElement('div');
    instance.mount(root);
  });
});
