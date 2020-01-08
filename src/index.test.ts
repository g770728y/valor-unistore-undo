import createStore from "unistore";
import { ICommand, CommandManager } from "./";

describe("command-manager", () => {
  it("case0, 无context", () => {
    const store = createStore<{ a: number }>({ a: 1 });

    class IncCommand extends ICommand<{ a: number }> {
      execute = () => {
        this._execute();
      };

      undo = () => {
        store.setState({ a: this.store.getState().a - 1 });
      };

      redo = () => {
        this._execute();
      };

      _execute = () => {
        store.setState({ a: this.store.getState().a + 1 });
      };
    }

    const commandManager = new CommandManager(store);

    expect(store.getState().a).toEqual(1);

    commandManager.execute(IncCommand as any);

    expect(store.getState().a).toEqual(2);
    expect(commandManager.undoStack.length).toEqual(1);
    expect(commandManager.redoStack.length).toEqual(0);

    // 可undo
    commandManager.undo();
    expect(store.getState().a).toEqual(1);
    expect(commandManager.undoStack.length).toEqual(0);
    expect(commandManager.redoStack.length).toEqual(1);

    // undo栈空, 无操作
    commandManager.undo();
    expect(store.getState().a).toEqual(1);
    expect(commandManager.undoStack.length).toEqual(0);
    expect(commandManager.redoStack.length).toEqual(1);

    // 可redo
    commandManager.redo();
    expect(store.getState().a).toEqual(2);
    expect(commandManager.undoStack.length).toEqual(1);
    expect(commandManager.redoStack.length).toEqual(0);

    // redo栈空, 无操作
    commandManager.redo();
    expect(store.getState().a).toEqual(2);
    expect(commandManager.undoStack.length).toEqual(1);
    expect(commandManager.redoStack.length).toEqual(0);
  });

  it("case1, 带context", () => {
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

    commandManager.execute(Inc_n_Command as any, 2);

    expect(store.getState().a).toEqual(3);
    expect(commandManager.undoStack.length).toEqual(1);
    expect(commandManager.redoStack.length).toEqual(0);

    // 可undo
    commandManager.undo();
    expect(store.getState().a).toEqual(1);
    expect(commandManager.undoStack.length).toEqual(0);
    expect(commandManager.redoStack.length).toEqual(1);
  });
});
