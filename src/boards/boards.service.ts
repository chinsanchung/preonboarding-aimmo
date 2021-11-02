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
    this.update = this.update.bind(this);
  }
  private async checkAuthToBoard({
    user_id,
    board_id,
  }: ICheckAuthToBoardInput): Promise<ICheckAuthToBoardOutput> {
    try {
      const board = await BoardModel.findOne({ _id: board_id })
        .select("user_id")
        .lean();
      // console.log("board: ", board);
      if (!board) return { ok: false, error: "일치하는 글이 없습니다." };

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
      console.log("error");
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
      Log.error("error");
      throw error;
    }
  }
}
