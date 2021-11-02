import { IBoard, BoardModel } from "../model/boards.model";
import { ICreateBoardDto } from "./boards.interface";

export class BoardService {
  constructor() {
    this.create = this.create.bind(this);
  }

  async create(createQuery: ICreateBoardDto): Promise<IBoard> {
    try {
      const response = await BoardModel.create(createQuery);
      console.log(response);
      return response;
    } catch (error) {
      console.log("error");
      throw error;
    }
  }
}
