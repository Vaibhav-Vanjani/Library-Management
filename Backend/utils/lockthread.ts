export default class Mutex {
  private lock: Promise<void>;

  constructor() {
    this.lock = Promise.resolve();
  }

  run<T>(fn: () => Promise<T> | T): Promise<T> {
    // Chain onto the existing lock
    const next = this.lock.then(() => fn());
    
    // Update lock to wait for next
    this.lock = next.then(() => undefined);

    // Return actual result of fn()
    return next;
  }
}