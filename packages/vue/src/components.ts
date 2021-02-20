import {
  defineComponent, PropType, provide, SetupContext, inject
} from 'vue';
import Bizic, { Provider, Exception } from 'bizic';

export const PROVIDER_KEY = Symbol('provider');
export const SAXONY_CORE_KEY = Symbol('bizic');

export interface RootProviderProps {
  bizic: Bizic;
  meta?: Record<PropertyKey, unknown>;
}

export const RootProvider = defineComponent({
  name: 'RootProvider',
  props: {
    bizic: { type: Object as PropType<RootProviderProps['bizic']>, required: true },
  },
  setup(props: RootProviderProps, context: SetupContext) {
    const provider = props.bizic.getRootProvider();
    provide(PROVIDER_KEY, provider);
    provide(SAXONY_CORE_KEY, props.bizic);
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
    const bizic = inject<Bizic>(SAXONY_CORE_KEY);
    if (bizic === undefined) {
      throw new Exception('No root provider found');
    }
    const provider = bizic.getScopedProvider(props.id, props.meta);
    const parentProvider = inject<Provider>(PROVIDER_KEY)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    provider.setParent(parentProvider);
    provide(PROVIDER_KEY, provider);
    return () => (context.slots.default ? context.slots.default()[0] : null);
  },

});
