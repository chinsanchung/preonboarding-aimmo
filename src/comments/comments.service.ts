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
}
