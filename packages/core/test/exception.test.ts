import { strict as assert } from 'assert';
import { Exception } from '../src';

describe('core/src/exception.ts', () => {
  it('exception should be ok', () => {
    const message = 'error message';
    const e = new Exception(message);
    assert(e instanceof Error);
    assert.equal(e.name, 'BizicException');
  });

  it('instance check should be ok', () => {
    const message = 'error message';
    const e = new Exception(message);
    assert(Exception.isBizicException(e));
  });
});
