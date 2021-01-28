import { strict as assert } from 'assert';
import { h, defineComponent, inject } from 'vue';
import Saxony from 'saxony';
import {
  SAXONY_CORE_KEY, PROVIDER_KEY, RootProvider, ScopedProvider
} from '../src/components';
import { createApp, nodeOps } from './vueTestUtils';
import useService from '../src/useService';

describe('vue/src/components.ts', () => {
  it('RootProvider provider should be ok', (cb) => {
    const saxony = new Saxony();

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
        return () => h(RootProvider, { saxony }, () => h(TestComponent));
      },
    });
    const root = nodeOps.createElement('div');
    instance.mount(root);
  });

  it('RootProvider props should be ok', (cb) => {
    const meta = { name: 'na' };

    const saxony = new Saxony({ meta });

    saxony.registerServiceFactory('service', (data) => {
      assert.equal(data, meta);
      return 1;
    });
    const TestComponent = defineComponent({
      setup() {
        const service = useService('service');
        assert.equal(service, 1);
        cb();

        return () => h('div');
      },
    });
    const instance = createApp({
      setup() {
        return () => h(RootProvider, { saxony }, () => h(TestComponent));
      },
    });
    const root = nodeOps.createElement('div');
    instance.mount(root);
  });

  it('RootProvider should be ok with empty children', () => {
    const saxony = new Saxony();
    const instance = createApp({
      setup() {
        return () => h(RootProvider, { saxony });
      },
    });
    const root = nodeOps.createElement('div');
    instance.mount(root);
  });

  it('ScopedProvider provider should be ok', (cb) => {
    const meta = { name: 'na' };

    const saxony = new Saxony({ meta });
    const scopedMeta = { name: 'scoped' };
    const scopeId = 'scopeId2';
    saxony.registerServiceFactory('service', (data) => {
      assert.equal(data, meta);
      return 1;
    });

    saxony.registerScopedServiceFactory(scopeId, 'scopedService', (data: unknown) => {
      const val = data as typeof scopedMeta & { scopeId: string };
      assert.equal(val.scopeId, scopeId);
      assert.equal(val.name, scopedMeta.name);
      return 2;
    });

    const TestComponent = defineComponent({
      setup() {
        assert.equal(saxony, inject(SAXONY_CORE_KEY));
        assert(inject(PROVIDER_KEY));
        const service = useService('service');
        assert.equal(service, 1);
        const scopedService = useService('scopedService');
        assert.equal(scopedService, 2);
        cb();
        return () => h('div');
      },
    });
    const instance = createApp({
      setup() {
        return () => h(
          RootProvider,
          { saxony },
          () => h(
            ScopedProvider,
            { id: scopeId, meta: scopedMeta },
            () => h(TestComponent)
          )
        );
      },
    });
    const root = nodeOps.createElement('div');
    instance.mount(root);
  });
  it('ScopedProvider should be ok with empty children', () => {
    const saxony = new Saxony();
    const scopeId = '2';

    const instance = createApp({
      setup() {
        return () => h(
          RootProvider,
          { saxony },
          () => h(
            ScopedProvider,
            { id: scopeId }
          )
        );
      },
    });
    const root = nodeOps.createElement('div');
    instance.mount(root);
  });
});
