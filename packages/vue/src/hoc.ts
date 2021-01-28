import {
  Component, h, ComponentOptionsMixin, defineComponent, SetupContext
} from 'vue';
import Saxony from 'saxony';
import { RootProvider, ScopedProvider } from './components';

export function withRootProvider<T extends Component>(
  component: T,
  saxony: Saxony,
  mixins: ComponentOptionsMixin[] = []
): T {
  return withComponentFactory(RootProvider, { saxony })(component, mixins);
}

export function withScopedProvider<T extends Component>(
  scopeId: string | symbol,
  component: T,
  meta: Record<PropertyKey, unknown> = {},
  mixins: ComponentOptionsMixin[] = []
): T {
  return withComponentFactory(ScopedProvider, { id: scopeId, meta })(component, mixins);
}

type PropsOf<T> = T extends Component<infer P> ? P : never;

export function withComponentFactory<T extends Component>(baseComponent: T, baseProps: PropsOf<T>) {
  return <C extends Component>(component: C, mixins: ComponentOptionsMixin[] = []): C => defineComponent({
    name: `With${baseComponent.name || 'Component'}`,
    mixins,
    setup(props: PropsOf<C>, ctx: SetupContext) {
      return () => h(
        baseComponent,
        baseProps,
        () => h(
          component,
          { ...props, ...ctx.attrs },
          () => ctx.slots.default?.()
        )
      );
    },
  }) as C;
}
