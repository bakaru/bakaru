import { ServerContext } from './server';

export interface Plugin {
  getId(): string
}

type PluginsList = Map<string, Plugin>;

export default class PluginManager {
  protected plugins: PluginsList = new Map();

  public get list(): PluginsList {
    return this.plugins;
  }

  public constructor(
    protected serverContext: ServerContext,
    plugins: any[] = []
  ) {
    for (let index in plugins) {
      this.register(plugins[index]);
    }
  }

  public register(pluginClass: any) {
    const plugin: Plugin = <Plugin>(new pluginClass(this.serverContext));

    this.plugins.set(plugin.getId(), plugin);
  }
}
