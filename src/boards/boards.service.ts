import { IBoard, BoardModel } from "../model/boards.model";
import { ICreateBoardDto } from "./boards.interface";
import Log from "../utils/debugger";

export class BoardService {
  constructor() {
    this.create = this.create.bind(this);
  }

  async create(createQuery: ICreateBoardDto): Promise<IBoard> {
    try {
      const response = await BoardModel.create(createQuery);
      return response;
    } catch (error) {
      Log.error("error");
      throw error;
    }
  }
}
