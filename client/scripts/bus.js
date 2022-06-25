import EventEmitter from 'eventemitter3';

export default (() => {
  const e = new EventEmitter();
  return e;
})();