class TestPlugin {
  /**
   * Ctor
   * @param {ServerContext} context
   */
  constructor(context) {
    this.version = '0.0.1';
    this.name = 'test';
    this.context = context;

    this.context.events.on('testEvent', () => {
      console.log('TestPlugin:testEvent')
    });
  }
}

class Plugins {
  /**
   * Ctor
   * @param {ServerContext} context
   */
  constructor(context) {
    this.context = context;

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
    const pluginObject = new plugin(this.context);

    this.plugins.set(pluginObject.name, pluginObject);
  }
}

module.exports = Plugins;
