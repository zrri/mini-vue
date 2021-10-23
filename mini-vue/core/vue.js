class Vue {
  constructor(options) {
    //保存options的数据
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    //把data中的成员转换成getter和setter，并注入到Vue实例中
    this._proxyData(this.$data)
    //调用Observer类, 监听数据的变化
    new Observer(this.$data)
    //调用compiler类，解析指令和插值表达式
    new Compiler(this)
  }
  _proxyData(data){
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newValue){
          if(newValue === data[key]){
            return
          }
          data[key] = newValue
        }
      })
    })
  }
}