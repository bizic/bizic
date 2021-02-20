const type = Symbol('type');

export default class Exception extends Error {
  name = 'BizicException';

  [type] = true;

  static isBizicException(e: unknown): e is Exception {
    return typeof e === 'object' && e !== null && (e as Exception)[type];
  }
}
