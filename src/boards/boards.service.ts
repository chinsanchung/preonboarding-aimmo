import createError from "../utils/createError";
import { IBoard, BoardModel } from "../model/boards.model";

import {
  ICreateBoardDto,
  IUpdateBoardDto,
  ICheckAuthToBoardInput,
  ICheckAuthToBoardOutput,
} from "./boards.interface";

import Log from "../utils/debugger";

export class BoardService {
  constructor() {
    this.create = this.create.bind(this);
    this.readOne = this.readOne.bind(this);
    this.readAll = this.readAll.bind(this);
    this.update = this.update.bind(this);
  }
  private async checkAuthToBoard({
    user_id,
    board_id,
  }: ICheckAuthToBoardInput): Promise<ICheckAuthToBoardOutput> {
    try {
      const board = await BoardModel.findOne({ _id: board_id })
        .select("user_id deleted_at")
        .lean();
      // console.log("board: ", board);
      if (!board) return { ok: false, error: "일치하는 글이 없습니다." };
      if (Object.prototype.hasOwnProperty.call(board, "deleted_at")) {
        return { ok: false, error: "이미 삭제한 게시글입니다." };
      }
      if (board?.user_id.equals(user_id)) {
        return { ok: true };
      } else {
        return { ok: false, error: "오직 작성자만 글에 접근할 수 있습니다." };
      }
    } catch (error) {
      // console.log("check board auth error", error);
      return { ok: false, error: "인증 실패" };
    }
  }
  async create(createQuery: ICreateBoardDto): Promise<IBoard> {
    try {
      const response = await BoardModel.create(createQuery);
      return response;
    } catch (error) {
      throw createError(500, "게시글 작성에 에러가 발생했습니다.");
    }
  }
  async update({
    user_id,
    board_id,
    updateQuery,
  }: IUpdateBoardDto): Promise<void> {
    const hasValidToEdit = await this.checkAuthToBoard({ user_id, board_id });
    if (!hasValidToEdit.ok) {
      throw createError(402, hasValidToEdit?.error || "에러가 발생했습니아.");
    } else {
      try {
        await BoardModel.updateOne(
          { _id: board_id },
          {
            $set: { ...updateQuery, updated_at: new Date() },
          }
        );
        return;
      } catch (error) {
        throw createError(500, "수정에 에러가 발생했습니다.");
      }
    }
  }
  async delete({ user_id, board_id }: { user_id: string; board_id: string }) {
    const hasValidToEdit = await this.checkAuthToBoard({ user_id, board_id });
    if (!hasValidToEdit.ok) {
      throw createError(402, hasValidToEdit?.error || "에러가 발생했습니다.");
    } else {
      try {
        await BoardModel.updateOne(
          { _id: board_id },
          {
            $set: { deleted_at: new Date() },
          }
        );
        return;
      } catch (error) {
        throw createError(500, "삭제에 에러가 발생했습니다.");
      }
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
