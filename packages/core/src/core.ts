import DI from './di';

export interface Plugin {
  install(core: Bizic): void;
}
export default class Bizic extends DI {
  use(plugin: Plugin): void {
    plugin.install(this);
  }
}
