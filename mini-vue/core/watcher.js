class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb

    //把watcher对象记录到Dep类的静态属性target中
    Dep.target = this
    //触发get方法，在get方法中会调用addSub
    this.oldValue = vm[key]
    //消除记录
    Dep.target = null
  }

  update() {
    const newValue = this.vm[this.key]
    if(this.oldValue === newValue) {
      return
    }
    //更新视图
    this.cb(newValue)
  }
}