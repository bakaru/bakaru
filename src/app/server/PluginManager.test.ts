import { expect } from 'chai';
import 'mocha';

import { ServerContext } from './server';
import PluginManager, { Plugin } from './PluginManager';

const ctx: ServerContext = {
  library: {},
  videoInfo: {}
};

class TestPlugin implements Plugin {
  constructor(serverContext: ServerContext) {
    // ...
  }

  public getId(): string {
    return 'test-plugin';
  }
}

describe('PluginManager', () => {
  it('should instantiate', () => {
    const pm = new PluginManager(ctx, []);

    expect(pm instanceof PluginManager).equal(true);
  });

  it('should instantiate with TestPlugin', () => {
    const pm = new PluginManager(ctx, [TestPlugin]);

    expect(pm.list.has('test-plugin')).equal(true);
  });
});
