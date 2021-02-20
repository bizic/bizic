import { strict as assert } from 'assert';
import Bizic, { Plugin } from '../src/core';

describe('core/src/core.ts', () => {
  it('plugin should be ok', (cb) => {
    const bizic = new Bizic();
    const plugin: Plugin = {
      install(b) {
        assert.equal(b, bizic);
        cb();
      },
    };
    bizic.use(plugin);
  });
});
