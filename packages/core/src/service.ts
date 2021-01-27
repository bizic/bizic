export default class Service {
  constructor(...args: unknown[]) { // eslint-disable-line @typescript-eslint/no-useless-constructor,@typescript-eslint/no-unused-vars
    // do nothing, only for types check
  }

  static create<T extends typeof Service>(this: T, ...args: unknown[]): InstanceType<T> {
    return (new this(...args)) as InstanceType<T>;
  }
}
