import { Types } from "mongoose";
import createError from "../utils/createError";
import { BoardModel } from "../model/boards.model";
import { CommentsModel } from "../model/comments.model";
export class CommentsService {
  public async writeComment(
    boardId: string,
    userId: Types.ObjectId,
    contents: string
  ): Promise<void> {
    const commentsInfo = await CommentsModel.create({
      board_id: boardId,
      user_id: userId,
      contents,
    });
    const boardInfo = await BoardModel.findOne({ _id: boardId });
    boardInfo?.comments_array.push(commentsInfo._id);
    boardInfo?.save();
  }

  public async deleteComment(
    boardId: string,
    commentId: string,
    userId: Types.ObjectId
  ): Promise<void> {
    const commentInfo = await CommentsModel.findOne({ _id: commentId });
    if (!commentInfo?.user_id.equals(userId)) {
      throw createError(403, "본인 댓글만 삭제할 수 있습니다.");
    }
    commentInfo.deleted_at = new Date();
    commentInfo.save();

    await BoardModel.updateOne(
      { _id: boardId },
      { $pull: { comments_array: commentId } }
    );
  }
}
