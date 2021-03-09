import { strict as assert } from 'assert';
import { h, defineComponent, inject } from 'vue';
import Bizic from 'bizic';
import {
  BIZIC_KEY, PROVIDER_KEY, RootProvider, ScopedProvider
} from '../src/components';
import { createApp, nodeOps } from './vueTestUtils';
import useService from '../src/useService';

describe('vue/src/components.ts', () => {
  it('RootProvider provider should be ok', (cb) => {
    const bizic = new Bizic();

    const TestComponent = defineComponent({
      setup() {
        assert.equal(bizic, inject(BIZIC_KEY));
        assert(inject(PROVIDER_KEY));
        cb();
        return () => h('div');
      },
    });
    const instance = createApp({
      setup() {
        return () => h(RootProvider, { bizic }, () => h(TestComponent));
      },
    });
    const root = nodeOps.createElement('div');
    instance.mount(root);
  });

  it('RootProvider props should be ok', (cb) => {
    const meta = { name: 'na' };

    const bizic = new Bizic({ meta });

    bizic.registerServiceFactory('service', (data) => {
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
        return () => h(RootProvider, { bizic, meta }, () => h(TestComponent));
      },
    });
    const root = nodeOps.createElement('div');
    instance.mount(root);
  });

  it('RootProvider should be ok with empty children', () => {
    const bizic = new Bizic();
    const instance = createApp({
      setup() {
        return () => h(RootProvider, { bizic });
      },
    });
    const root = nodeOps.createElement('div');
    instance.mount(root);
  });

  it('ScopedProvider provider should be ok', (cb) => {
    const meta = { name: 'na' };

    const bizic = new Bizic();
    const scopedMeta = { name: 'scoped' };
    const scopeId = 'scopeId2';
    bizic.registerServiceFactory('service', (data) => {
      assert.equal(data, meta);
      return 1;
    });

    bizic.registerScopedServiceFactory(scopeId, 'scopedService', (data: unknown) => {
      const val = data as typeof scopedMeta & { scopeId: string };
      assert.equal(val.scopeId, scopeId);
      assert.equal(val.name, scopedMeta.name);
      return 2;
    });

    const TestComponent = defineComponent({
      setup() {
        assert.equal(bizic, inject(BIZIC_KEY));
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
          { bizic, meta },
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
    const bizic = new Bizic();
    const scopeId = '2';

    const instance = createApp({
      setup() {
        return () => h(
          RootProvider,
          { bizic },
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
