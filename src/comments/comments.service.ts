import { Types } from "mongoose";
import { CommentsModel } from "../model/comments.model";
export class CommentsService {
  public async writeComment(
    boardId: Types.ObjectId,
    userId: Types.ObjectId,
    contents: string
  ): Promise<any> {
    const commentsInfo = await CommentsModel.findOneAndUpdate(
      {
        board_id: boardId,
      },
      {},
      { upsert: true }
    );
    commentsInfo?.comments_array.push({
      user_id: userId,
      contents,
    });
    commentsInfo?.save();
  }

  public async deleteComment( 
    boardId: Types.ObjectId,
    commentId: Types.ObjectId
  ): Promise<void> {
    const commentInfo = await CommentsModel.updateOne(
      {
        board_id: boardId,
        comments_array: { $elemMatch: { _id: commentId } },
      },
      { $set: { deleted_at: Date.now() } }
    );
  }
}
