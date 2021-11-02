import { Types } from "mongoose";
import { BoardModel } from "../model/boards.model";
import { CommentsModel } from "../model/comments.model";
export class CommentsService {
  public async writeComment(
    boardId: string,
    userId: Types.ObjectId,
    contents: string
  ): Promise<any> {    
    const commentsInfo = await CommentsModel.create({
      board_id: boardId,
      user_id: userId,
      contents,
    });    
    const boardInfo = await BoardModel.findOne({ _id: boardId });
    console.log(`commentsInfo._id  : ` ,commentsInfo._id);
    console.log(` boardInfo : ` ,boardInfo);
    
    boardInfo?.comments_array.push(commentsInfo._id);
    boardInfo?.save();
  }

  public async deleteComment(
    boardId: Types.ObjectId,
    commentId: Types.ObjectId
  ): Promise<void> {
    const commentInfo = await CommentsModel.updateOne(
      {
        board_id: boardId,
      },
      {
        $set: {
          "comments_array.$[elem1].deleted_at": new Date(),
        },
      },
      {
        arrayFilters: [
          {
            "elem1._id": commentId,
          },
        ],
      }
    );

  }
}
