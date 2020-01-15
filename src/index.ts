import { Store } from "unistore";

export abstract class ICommand<StoreData> {
  store: Store<StoreData>;
  params: any;
  undoContext: { style: any } = {} as any;

  //注意构造方法带参, 这反应了 command 的本质
  constructor(store: Store<StoreData>, params?: any) {
    this.store = store;
    this.params = params || undefined;
  }

  // 第一次执行
  abstract execute: () => boolean;

  // undo
  abstract undo: () => void;
}

export class CommandManager<StoreData> {
  undoStack: ICommand<StoreData>[] = [];
  redoStack: ICommand<StoreData>[] = [];

  constructor(public store: Store<StoreData>) {}

  execute = (
    Command: new (store: Store<StoreData>, params?: any) => ICommand<StoreData>,
    params?: any
  ) => {
    const command = new Command(this.store, params);

    if (command.execute()) {
      this.undoStack.push(command);
      this.redoStack = [];
    }
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
      command.execute();
      this.undoStack.push(command);
    }
  };
}
