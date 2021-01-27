import {
  defineComponent, PropType, provide, SetupContext, inject
} from 'vue';
import AukCore, { Provider } from 'auk';

export const PROVIDER_KEY = Symbol('provider');
export const AUK_CORE_KEY = Symbol('aukCore');

export interface RootProviderProps {
  auk: AukCore;
  meta?: Record<PropertyKey, unknown>;
}

export const RootProvider = defineComponent({
  name: 'RootProvider',
  props: {
    auk: { type: Object as PropType<RootProviderProps['auk']>, required: true },
  },
  setup(props: RootProviderProps, context: SetupContext) {
    const provider = props.auk.getRootProvider();
    provide(PROVIDER_KEY, provider);
    provide(AUK_CORE_KEY, props.auk);
    return () => (context.slots.default ? context.slots.default()[0] : null);
  },
});

export interface ScopedProviderProps {
  id: string | symbol;
  meta?: Record<PropertyKey, unknown>;
}

export const ScopedProvider = defineComponent({
  name: 'ScopedProvider',
  props: {
    id: { type: [String, Symbol] as PropType<ScopedProviderProps['id']>, required: true },
    meta: { type: Object as PropType<ScopedProviderProps['meta']>, required: false },
  },
  setup(props: ScopedProviderProps, context: SetupContext) {
    const aukCore = inject<AukCore>(AUK_CORE_KEY);
    if (aukCore === undefined) {
      throw new Error('No root provider found');
    }
    const provider = aukCore.getScopedProvider(props.id, props.meta);
    const parentProvider = inject<Provider>(PROVIDER_KEY)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    provider.setParent(parentProvider);
    provide(PROVIDER_KEY, provider);
    return () => (context.slots.default ? context.slots.default()[0] : null);
  },

});
