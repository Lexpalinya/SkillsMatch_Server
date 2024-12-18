export interface TmodelHandlerCreate {
  name: string;
  userId: string;
  visible?: boolean;
}

export interface TmodelHandlerUpdate {
  name?: string;
  userId?: string;
  visible?: boolean;
}

export interface ServiceInterface {
  FindByName(args: { name: string }): Promise<any>;
  FindOne(id: string): Promise<any>;
  FindMany(): Promise<any[]>;
  Create(args: {
    name: string;
    userId: string;
    visible?: boolean;
  }): Promise<any>;
  Update(
    filter: { id: string },
    updates: { name?: string; userId?: string; visible?: boolean }
  ): Promise<any>;
  Delete(filter: { id: string }): Promise<any>;
  SelectVisible(filter: {}): Promise<any>;
}
