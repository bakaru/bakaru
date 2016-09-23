const bluebird = require('bluebird');
const FPQ = require('fastpriorityqueue');

function FPQComparator(a, b) {
  return a[0] < b[0];
}

class MediaDiscovery {
  constructor() {
    this.queue = new FPQ(FPQComparator);
    this.queueing = false;
  }

  enqueue(filePath, priority = MediaDiscovery.LowPriority) {
    this.queue.add([priority, filePath])
  }

  work() {
    if (this.queueing) {
      return false;
    }

    this.queueing = true;

    while (this.queue.isEmpty() === false) {

    }

    this.queueing = false;
  }

  processFile(filePath) {

  }
}

MediaDiscovery.HighPriority = 1;
MediaDiscovery.LowPriority = 0;

module.exports = MediaDiscovery;
