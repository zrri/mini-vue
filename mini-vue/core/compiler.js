class Compiler {
  constructor(vm) {
    this.vm = vm
    this.el = vm.$el
    this.compiler(this.el)
  }
  //编译
  compiler(el) {
    const childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if(this.isTextNode(node)) {
        //处理文本节点
        this.compilerText(node)
      } else if(this.isElementNode(node)) {
        // 处理元素节点
        this.compilerElement(node)
      }
      
      if(node.childNodes.length) {
        this.compiler(node)
      }
    })
  }

  //判断节点是否属于文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }

  //判断节点书否属于元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }

  //判断元素属性是否属于指令
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }

  //编译文本节点，处理插值表达式
  compilerText(node) {
    const reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if(reg.test(value)) {
      //假设只有一个插值表达式
      const key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])

      //创建 Watcher对象，当数据改变时更新视图
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue
      })

    }
  }

  //编译元素节点，处理指令
  compilerElement(node) {
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name
      if(this.isDirective(attrName)) {
        attrName = attrName.substr(2)
        const key = attr.value
        this.update(node, key, attrName)
      }
    })
  }

  //执行不同指令的方法
  update(node, key, attrName) {
    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn.call(this, node, this.vm[key], key)
  }

  //处理v-text指令
  textUpdater(node, value, key) {
    node.textContent = value

    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }

  //处理v-model指令
  modelUpdater(node, value, key) {
    node.value = value

    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })

    //双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }
}