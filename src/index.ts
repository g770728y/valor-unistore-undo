import { Store } from "unistore";

export abstract class ICommand<StoreData> {
  constructor(public store: Store<StoreData>) {}
  // 第一次执行, 必带参
  abstract execute: (params?: any) => any;
  // 后面的执行不带参
  abstract undo: () => any;
  abstract redo: () => any;
}

export class CommandManager<StoreData> {
  undoStack: ICommand<StoreData>[] = [];
  redoStack: ICommand<StoreData>[] = [];

  constructor(public store: Store<StoreData>) {}

  execute = <T extends typeof ICommand>(Command: T, params?: any) => {
    // @ts-ignore
    const command = new Command(this.store, params);

    const patch = command.execute(params);
    this.store.setState(patch);
    this.undoStack.push(command);
    this.redoStack = [];
  };

  undo = () => {
    const command = this.undoStack.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
    }
  };

  redo = () => {
    const command = this.redoStack.pop();
    if (command) {
      command.redo();
      this.undoStack.push(command);
    }
  };
}
