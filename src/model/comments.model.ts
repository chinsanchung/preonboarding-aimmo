import { Schema, model, Types } from "mongoose";

interface ICommentsArray {
  user_id: Types.ObjectId;
  contents: string;
  created_at: Date;
  deleted_at?: Date | null;
}
interface IComments {
  board_id: Types.ObjectId;
  comments_array: ICommentsArray[];
}

const commentsArraySchema = new Schema<ICommentsArray>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    contents: { type: String, default: "" },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at" } }
);

const schema = new Schema<IComments>({
  board_id: { type: Schema.Types.ObjectId, ref: "boards", required: true },
  comments_array: { type: [commentsArraySchema], default: [] },
});

const CommentsModel = model<IComments>("comments", schema);

export { CommentsModel, IComments };
