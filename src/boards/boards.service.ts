import mongoose from "mongoose";
import createError from "../utils/createError";
import { IBoard, BoardModel } from "../model/boards.model";

import {
  ICreateBoardDto,
  IUpdateBoardDto,
  ICheckAuthToBoardInput,
  ICheckAuthToBoardOutput,
} from "./boards.interface";

import Log from "../utils/debugger";
import { CommentsModel } from "../model/comments.model";

export class BoardService {
  constructor() {
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.readAll = this.readAll.bind(this);
    this.readOne = this.readOne.bind(this);
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
  private writerInfoQuery = [
    {
      $lookup: {
        from: "users",
        let: { user_id: "$user_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
          {
            $project: {
              _id: 0,
              email: "$email",
              name: "$name",
            },
          },
        ],
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
  ];

  async readOne(id: string) {
    Log.info("id: ", id);
    try {
      // return await BoardModel.findOne({ _id: id });
      // 출처: https://stackoverflow.com/a/38946553
      const _id = new mongoose.Types.ObjectId(id);
      const response = await BoardModel.aggregate([
        { $match: { _id } },
        ...this.writerInfoQuery,
        {
          $project: {
            _id: 1,
            title: 1,
            contents: 1,
            view_cnt: { $size: "$view_cnt" },
            comments_cnt: { $size: "$comments_array" },
            created_at: 1,
            comments_array: 1,
            user_name: "$userInfo.name",
          },
        },
      ]);
      Log.info("response: ", response.length);
      if (response.length === 0) {
        throw createError(404, "해당하는 글이 없습니다.");
      } else {
        if (response[0].comments_array.length > 0) {
          const commentsWithUserInfo = await CommentsModel.aggregate([
            { $match: { _id: { $in: response[0].comments_array } } },
            ...this.writerInfoQuery,
            {
              $project: {
                _id: 1,
                contents: 1,
                created_at: 1,
                answers_array: 1,
                user_name: "$userInfo.name",
              },
            },
          ]);
          return { ...response[0], comments: commentsWithUserInfo };
        }
        return { ...response[0], comments: [] };
      }
    } catch (error) {
      Log.error(error);
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
      const response = await BoardModel.aggregate([
        { $match: { $and: andOption } },
        { $skip: offset },
        { $limit: limit },
        ...this.writerInfoQuery,
        {
          $project: {
            _id: 1,
            title: 1,
            contents: 1,
            view_cnt: { $size: "$view_cnt" },
            created_at: 1,
            comments_cnt: { $size: "$comments_array" },
            user_name: "$userInfo.name",
          },
        },
      ]);

      return { count, data: response };
    } catch (error) {
      console.log("error");
      throw error;
    }
  }
}
