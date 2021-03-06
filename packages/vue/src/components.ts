import {
  defineComponent, PropType, provide, SetupContext, inject
} from 'vue';
import Bizic, { Provider, Exception } from 'bizic';

export const PROVIDER_KEY = Symbol('provider');
export const BIZIC_KEY = Symbol('bizic');

export interface RootProviderProps {
  bizic: Bizic;
  meta?: Record<PropertyKey, unknown>;
}

export const RootProvider = defineComponent({
  name: 'RootProvider',
  props: {
    bizic: { type: Object as PropType<RootProviderProps['bizic']>, required: true },
    meta: { type: Object as PropType<ScopedProviderProps['meta']>, required: false },
  },
  setup(props: RootProviderProps, context: SetupContext) {
    const provider = props.bizic.getRootProvider(props.meta);
    provide(PROVIDER_KEY, provider);
    provide(BIZIC_KEY, props.bizic);
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
    const bizic = inject<Bizic>(BIZIC_KEY);
    if (bizic === undefined) {
      throw new Exception('No root provider found');
    }
    const parentProvider = inject<Provider>(PROVIDER_KEY)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    const provider = bizic.getScopedProvider(props.id, parentProvider, props.meta);
    provide(PROVIDER_KEY, provider);
    return () => (context.slots.default ? context.slots.default()[0] : null);
  },

});
