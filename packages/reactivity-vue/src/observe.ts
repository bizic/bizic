import {
  computed, ComputedRef, reactive, shallowReactive, markRaw, readonly, shallowReadonly
} from '@vue/reactivity';

export function observable<T>(obj: T): T {
  return makeObservable(obj, true);
}

export function shallowObservable<T>(obj: T): T {
  return makeObservable(obj, false);
}

export function makeObservable<T>(obj: T, deep: boolean): T { // eslint-disable-line @typescript-eslint/no-shadow
  if (!isObject(obj)) return obj;
  const getters = getGetterMap(obj);
  let objProxy = obj;

  if (getters !== null) {
    const computedValues: Record<PropertyKey, ComputedRef<unknown>> = {};
    objProxy = new Proxy(obj, {
      get(target: typeof obj, p: string | number, receiver: unknown): unknown {
        if (getters[p]) {
          if (p in computedValues) {
            return computedValues[p].value;
          }
          const computedRef = computed(() => Reflect.get(obj, p, receiver));
          computedValues[p] = computedRef;
          return computedValues[p].value;
        }
        return Reflect.get(target, p, receiver);
      },
    });
  }

  return deep ? reactive(objProxy) as T : shallowReactive(objProxy);
}

export function getGetterMap<T extends object>(obj: T): Record<PropertyKey, true> | null { // eslint-disable-line @typescript-eslint/ban-types
  if (!isPlainObject(obj)) return null;
  const getterMap: Record<PropertyKey, true> = {};
  const prototype = Reflect.getPrototypeOf(obj);
  if (prototype === null) return null;
  if (prototype.constructor === Object) return null;
  const descriptors = Object.getOwnPropertyDescriptors(prototype);
  Object.keys(descriptors).forEach((key) => {
    const descriptor = descriptors[key];
    if (descriptor.get !== undefined) {
      getterMap[key] = true;
    }
  });
  if (Object.keys(getterMap).length === 0) return null;
  return getterMap;
}

function isPlainObject(obj: unknown): obj is object { // eslint-disable-line @typescript-eslint/ban-types
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function isObject(obj: unknown): obj is object { // eslint-disable-line @typescript-eslint/ban-types
  return obj !== null && typeof obj === 'object';
}

export {
  markRaw,
  readonly,
  shallowReadonly
};
