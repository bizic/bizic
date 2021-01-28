import {
  defineComponent, PropType, provide, SetupContext, inject
} from 'vue';
import Saxony, { Provider } from 'saxony';

export const PROVIDER_KEY = Symbol('provider');
export const SAXONY_CORE_KEY = Symbol('saxony');

export interface RootProviderProps {
  saxony: Saxony;
  meta?: Record<PropertyKey, unknown>;
}

export const RootProvider = defineComponent({
  name: 'RootProvider',
  props: {
    saxony: { type: Object as PropType<RootProviderProps['saxony']>, required: true },
  },
  setup(props: RootProviderProps, context: SetupContext) {
    const provider = props.saxony.getRootProvider();
    provide(PROVIDER_KEY, provider);
    provide(SAXONY_CORE_KEY, props.saxony);
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
    const saxonyCore = inject<Saxony>(SAXONY_CORE_KEY);
    if (saxonyCore === undefined) {
      throw new Error('No root provider found');
    }
    const provider = saxonyCore.getScopedProvider(props.id, props.meta);
    const parentProvider = inject<Provider>(PROVIDER_KEY)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    provider.setParent(parentProvider);
    provide(PROVIDER_KEY, provider);
    return () => (context.slots.default ? context.slots.default()[0] : null);
  },

});
