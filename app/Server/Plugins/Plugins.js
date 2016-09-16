class TestPlugin {
  /**
   * Ctor
   * @param {Server} server
   */
  constructor(server) {
    this.version = '0.0.1';
    this.name = 'test';
    this.server = server;

    this.server.events.on('testEvent', () => {
      console.log('TestPlugin:testEvent')
    });
  }
}

export default class Plugins {
  /**
   * Ctor
   * @param {Server} server
   */
  constructor(server) {
    this.server = server;

    this.plugins = new Map();

    this.initBuiltInPlugins();
  }

  initBuiltInPlugins() {
    this.addPlugin(TestPlugin);
  }

  /**
   *
   * @param {*} plugin
   */
  addPlugin(plugin) {
    const pluginObject = new plugin(this.server);

    this.plugins.set(pluginObject.name, pluginObject);
  }
}