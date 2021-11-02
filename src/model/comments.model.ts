import { Schema, model, Types } from "mongoose";

interface ICommentsArray {
  member_id: Types.ObjectId;
  contents: string;
  created_at: Date | number;
  deleted_at?: Date;
}
interface IComments {
  board_id: Types.ObjectId;
  comments_array: ICommentsArray[];
}

const commentsArraySchema = new Schema<ICommentsArray>({
  member_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
  contents: { type: String, default: "" },
  created_at: { type: Date, default: Date.now, required: true },
  deleted_at: { type: Date },
});

const schema = new Schema<IComments>({
  board_id: { type: Schema.Types.ObjectId, ref: "boards", required: true },
  comments_array: { type: [commentsArraySchema], default: [] },
});

const CommentsModel = model<IComments>("comments", schema);

export { CommentsModel, IComments };
