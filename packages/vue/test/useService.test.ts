import { strict as assert } from 'assert';
import Saxony from 'saxony';
import { defineComponent, h } from 'vue';
import useService from '../src/useService';
import { createApp, nodeOps } from './vueTestUtils';
import { RootProvider } from '../src/components';

describe('vue/src/useService.ts', () => {
  it('useService should be ok', (cb) => {
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
        return () => h(RootProvider, { saxony, meta }, () => h(TestComponent));
      },
    });
    const root = nodeOps.createElement('div');
    instance.mount(root);
  });

  it('useService should throw an error when provider does not exist', (cb) => {
    const TestComponent = defineComponent({
      setup() {
        assert.throws(() => {
          useService('service');
        });
        cb();

        return () => h('div');
      },
    });
    const instance = createApp({
      setup() {
        return () => h(TestComponent);
      },
    });
    const root = nodeOps.createElement('div');
    instance.mount(root);
  });
});
