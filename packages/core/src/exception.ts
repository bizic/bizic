const type = Symbol('type');

export default class Exception extends Error {
  name = 'BizicException';

  [type]: undefined;

  static isBizicException(e: unknown): e is Exception {
    return typeof e === 'object' && e !== null && type in e;
  }
}
