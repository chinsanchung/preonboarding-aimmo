import { Types } from "mongoose";
import createError from "../utils/createError";
import { BoardModel } from "../model/boards.model";
import { CommentsModel } from "../model/comments.model";
import { AnswersModel } from "../model/answers.model";

export class AnswersService {
  public async writeAnswer(
    commentId: string,
    userId: Types.ObjectId,
    contents: string
  ): Promise<void> {
    const commentsInfo = await AnswersModel.create({
      comment_id: commentId,
      user_id: userId,
      contents,
    });
    const commentInfo = await CommentsModel.findOne({ _id: commentId });
    commentInfo?.answers_array.push(commentsInfo._id);
    commentInfo?.save();
  }

  public async deleteAnswer(
    commentId: string,
    answerId: string,
    userId: Types.ObjectId
  ): Promise<void> {
    const answerInfo = await AnswersModel.findOne({ _id: answerId });
    if (!answerInfo?.user_id.equals(userId)) {
      throw createError(403, "본인 댓글만 삭제할 수 있습니다.");
    }
    answerInfo.deleted_at = new Date();
    answerInfo.save();

    await CommentsModel.updateOne(
      { _id: commentId },
      { $pull: { answers_array: answerId } }
    );
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
  public async AnswerList(
    commentId: string,
    limit: number,
    offset: number
  ): Promise<{ count: number; data: any[] }> {
    const _id = new Types.ObjectId(commentId);
    const count = await AnswersModel.findOne({
      comment_id: _id,
      deleted_at: { $eq: null },
    }).countDocuments();
    const response = await AnswersModel.aggregate([
      {
        $match: { $and: [{ comment_id: _id }, { deleted_at: { $eq: null } }] },
      },
      { $skip: offset },
      { $limit: limit },
      ...this.writerInfoQuery,
      {
        $project: {
          _id: 1,
          comment_id: 1,
          contents: 1,
          created_at: 1,
          user_name: "$userInfo.name",
        },
      },
    ]);
    return { count, data: response };
  }
}
