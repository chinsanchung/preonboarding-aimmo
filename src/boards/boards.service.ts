import { IBoard, BoardModel } from "../model/boards.model";
import { ICreateBoardDto } from "./boards.interface";

export class BoardService {
  constructor() {
    this.create = this.create.bind(this);
    this.readOne = this.readOne.bind(this);
    this.readAll = this.readAll.bind(this);
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

  async readOne(id: string): Promise<IBoard | null> {
    try {
      return await BoardModel.findOne({ _id: id });
    } catch (error) {
      console.log("error");
      throw error;
    }
  }

  async readAll(
    title: string,
    contents: string,
    limit: number,
    offset: number
  ) {
    try {
      const andOption: any[] = [{ deleted_at: { $eq: null } }];
      if (title) {
        const regexTitle = new RegExp(title, "i");
        andOption.push({ title: regexTitle });
      }
      if (contents) {
        const regexContents = new RegExp(contents, "i");
        andOption.push({ contents: regexContents });
      }
      const count = await BoardModel.find({
        $and: andOption,
      }).countDocuments();
      const response = await BoardModel.find({
        $and: andOption,
      })
        .skip(offset)
        .limit(limit)
        .lean();
      return { count, data: response };
    } catch (error) {
      console.log("error");
      throw error;
    }
  }
}
