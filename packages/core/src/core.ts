import DI from './di';

export interface Plugin {
  install(core: AukCore): void;
}
export default class AukCore extends DI {
  use(plugin: Plugin): void {
    plugin.install(this);
  }
}
