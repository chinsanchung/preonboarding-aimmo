import { Schema, model, Types } from "mongoose";
interface IComments {
  board_id: Types.ObjectId;
  contents: string;
  user_id: Types.ObjectId;
  created_at: Date;
  deleted_at?: Date | null;
  answers_array: Schema.Types.ObjectId[];
}
const schema = new Schema<IComments>(
  {
    board_id: { type: Schema.Types.ObjectId, ref: "boards", required: true },
    contents: { type: String, default: "" },
    user_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    deleted_at: { type: Date, default: null },
    answers_array: {
      type: [Schema.Types.ObjectId],
      ref: "answers",
      default: [],
    },
  },
  { timestamps: { createdAt: "created_at" } }
);
const CommentsModel = model<IComments>("comments", schema);
export { CommentsModel, IComments };
