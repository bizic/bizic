import DI from './di';

export interface Plugin {
  install(core: Saxony): void;
}
export default class Saxony extends DI {
  use(plugin: Plugin): void {
    plugin.install(this);
  }
}
