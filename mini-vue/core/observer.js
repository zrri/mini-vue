class Observer {
  constructor(data) {
    this.walk(data)
  }
  //遍历data中的属性为响应式数据
  walk(data) {
    if(!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  //定义响应式数据
  defineReactive(obj, key, value) {
    const self = this
    //收集依赖并发送通知
    let dep = new Dep()
    //通过递归遍历深层属性为响应式数据
    this.walk(value)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        //收集依赖
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set(newValue) {
        if(value === newValue) {
          return
        }
        value = newValue
        //将新设置的值也转换成响应式数据
        self.walk(newValue)
        //发送通知
        dep.notify()
      }
    })
  }
}