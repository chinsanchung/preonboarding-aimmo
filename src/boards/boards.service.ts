import { IBoard, BoardModel } from "../model/boards.model";
import { ICreateBoardDto } from "./boards.interface";

export class BoardService {
  constructor() {
    this.create = this.create.bind(this);
    this.readOne = this.readOne.bind(this);
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
      const response = await BoardModel.findOne({ _id: id });
      //console.log(response);
      return response;
    } catch (error) {
      console.log("error");
      throw error;
    }
  }

  async readAll(page: number, title: string, contents: string) {
    try {
      if (title && contents) {
        // 검색어 둘다 있는경우
        const regexTitle = new RegExp(title, "i");
        const regexContents = new RegExp(contents, "i");
        const count = await BoardModel.find({
          $and: [
            { contents: regexContents },
            { title: regexTitle },
            { deleted_at: { $eq: null } },
          ],
        }).countDocuments();
        const response = await BoardModel.find({
          $and: [
            { contents: regexContents },
            { title: regexTitle },
            { deleted_at: { $eq: null } },
          ],
        })
          .skip(page * 10)
          .limit(10)
          .lean();
        const obj = { count, data: response };
        return obj;
      } else if (!title && contents) {
        // 콘텐츠만 있는경우
        const regexContents = new RegExp(contents, "i");
        const count = await BoardModel.find({
          $and: [{ countents: regexContents }, { deleted_at: { $eq: null } }],
        }).countDocuments();
        const response = await BoardModel.find({
          $and: [{ contents: regexContents }, { deleted_at: { $eq: null } }],
        })
          .skip(page * 10)
          .limit(10)
          .lean();
        const obj = { count, data: response };
        return obj;
      } else if (!contents && title) {
        // 타이틀만 있는경우
        const regexTitle = new RegExp(title, "i");
        const count = await BoardModel.find({
          $and: [{ title: regexTitle }, { deleted_at: { $eq: null } }],
        }).countDocuments();
        console.log(count);
        const response = await BoardModel.find({
          $and: [{ title: regexTitle }, { deleted_at: { $eq: null } }],
          // title: regexTitle,
        })
          .skip(page * 10)
          .limit(10)
          .lean();
        const obj = { count, data: response };
        return obj;
      } else {
        // 검색어 둘다 없는경우
        const count = await BoardModel.find({
          deleted_at: { $eq: null },
        }).countDocuments();
        const response = await BoardModel.find({ deleted_at: { $eq: null } })
          .skip(page * 10)
          .limit(10)
          .lean();
        const obj = { count, data: response };
        return obj;
      }
    } catch (error) {
      console.log("error");
      throw error;
    }
  }
}
