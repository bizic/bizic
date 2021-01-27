import {
  track, trigger, TriggerOpTypes, TrackOpTypes, computed, ComputedRef
  // eslint-disable-next-line import/no-extraneous-dependencies
} from '@vue/reactivity';

export enum AnnotationType {
  OBSERVABLE = 'observable',
  COMPUTED = 'computed',
}

const VUE_REACTIVE_FLAG = '__v_isReactive';

export type AnnotationMap<T extends object> = { // eslint-disable-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends (...args: any) => any ? never : AnnotationType // eslint-disable-line @typescript-eslint/no-explicit-any
};
export function makeObserver<T extends object>(obj: T, annotations: Partial<AnnotationMap<T>>): T { // eslint-disable-line @typescript-eslint/ban-types
  if (Reflect.get(obj, VUE_REACTIVE_FLAG)) return obj;
  const annotationMap: Record<PropertyKey, AnnotationType> = annotations as Record<PropertyKey, AnnotationType>;
  const computedValues: Record<PropertyKey, ComputedRef<unknown>> = {};
  return new Proxy(obj, {
    get(target: T, p: string | number, receiver: unknown): unknown {
      if (annotationMap[p] !== undefined) {
        if (annotationMap[p] === AnnotationType.COMPUTED) {
          if (p in computedValues) {
            return computedValues[p].value;
          }
          const computedRef = computed(() => Reflect.get(obj, p, receiver));
          computedValues[p] = computedRef;
          return computedValues[p].value;
        }
        track(target, 'get' as TrackOpTypes, p);
      }
      if (p === VUE_REACTIVE_FLAG) return true;
      return Reflect.get(target, p, receiver);
    },
    set(target: T, p: string | number, val: unknown, receiver: unknown): boolean {
      const observedVal = val;
      if (annotationMap[p] !== undefined) {
        trigger(target, 'set' as TriggerOpTypes, p);
      }

      return Reflect.set(target, p, observedVal, receiver);
    },
    defineProperty(target: T, p: string | number, attributes: PropertyDescriptor): boolean {
      if (annotationMap[p] !== undefined) {
        trigger(target, 'add' as TriggerOpTypes, p);
      }
      return Reflect.defineProperty(target, p, attributes);
    },
    deleteProperty(target: T, p: string | number): boolean {
      if (annotationMap[p] !== undefined && annotationMap[p as keyof T] !== AnnotationType.COMPUTED) {
        trigger(target, 'delete' as TriggerOpTypes, p);
      }
      return Reflect.deleteProperty(target, p);
    },
  });
}

export function makeAutoObserver<T extends object>(obj: T): T { // eslint-disable-line @typescript-eslint/ban-types
  const annotations: AnnotationMap<T> = getAutoObserverAnnotationMap<T>(obj);
  return makeObserver(obj, annotations);
}

export function getAutoObserverAnnotationMap<T extends object>(obj: T): AnnotationMap<T> { // eslint-disable-line @typescript-eslint/ban-types
  const annotations: Record<PropertyKey, AnnotationType> = {};
  Object.keys(obj).forEach((key) => {
    annotations[key] = AnnotationType.OBSERVABLE;
  });
  const prototype = Reflect.getPrototypeOf(obj);
  const descriptors = Object.getOwnPropertyDescriptors(prototype);
  Object.keys(descriptors).forEach((key) => {
    const descriptor = descriptors[key];
    if (descriptor.get !== undefined) {
      annotations[key] = AnnotationType.COMPUTED;
    }
  });
  return annotations as AnnotationMap<T>;
}
