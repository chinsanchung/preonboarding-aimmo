import { Schema, model, Types } from "mongoose";

interface ICommentsArray {
  member_id: Types.ObjectId;
  contents: string;
}
interface IComments {
  board_id: Types.ObjectId;
  comments_array: ICommentsArray[];
}

const commentsArraySchema = new Schema<ICommentsArray>({
  member_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
  contents: { type: String, default: "" },
});

const schema = new Schema<IComments>({
  board_id: { type: Schema.Types.ObjectId, ref: "boards", required: true },
  comments_array: { type: [commentsArraySchema], default: [] },
});

const CommentsModel = model<IComments>("comments", schema);

export { CommentsModel, IComments };
