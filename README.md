# 经典的命令模式, 实现 undo/redo

依赖`unistore`

# 如何在`react`组件中使用

在`react`顶级组件中增加一个 commandManager 属性, 绑定`store`
然后可在外部`ref.commandManager`使用

当然你也可以使用 controller 钩子, 把 commandManager 暴露出去.

# 具体使用方法:

详细参见 `index.test.ts`

```
// 第一步: store 及 Command类的 定义
    const store = createStore<{ a: number }>({ a: 1 });

    class Inc_n_Command extends ICommand<{ a: number }> {
      n: number = 0;
      execute = (n: number) => {
        this.n = n;
        this._execute();
      };

      undo = () => {
        store.setState({ a: this.store.getState().a - this.n });
      };

      redo = () => {
        this._execute();
      };

      _execute = () => {
        store.setState({ a: this.store.getState().a + this.n });
      };
    }

    const commandManager = new CommandManager(store);

    expect(store.getState().a).toEqual(1);

// 第二步: 使用
    commandManager.execute(Inc_n_Command as any, 2);

    expect(store.getState().a).toEqual(3);
    expect(commandManager.undoStack.length).toEqual(1);
    expect(commandManager.redoStack.length).toEqual(0);

    // 可undo
    commandManager.undo();
    expect(store.getState().a).toEqual(1);
    expect(commandManager.undoStack.length).toEqual(0);
    expect(commandManager.redoStack.length).toEqual(1);

    // 可redo
    commandManager.redo();
    expect(store.getState().a).toEqual(2);
    expect(commandManager.undoStack.length).toEqual(1);
    expect(commandManager.redoStack.length).toEqual(0);
```
