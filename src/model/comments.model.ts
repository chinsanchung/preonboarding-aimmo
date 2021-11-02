import { Schema, model, Types } from "mongoose";
interface IComments {
  contents: string;
  user_id: Types.ObjectId;
  created_at: Date;
  deleted_at?: Date | null;
  answers: Schema.Types.ObjectId[];
}
const schema = new Schema<IComments>(
  {
    contents: { type: String, default: "" },
    user_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    deleted_at: { type: Date, default: null },
    answers: {
      type: [Schema.Types.ObjectId],
      ref: "answers",
      default: [],
    },
  },
  { timestamps: { createdAt: "created_at" } }
);
const CommentsModel = model<IComments>("comments", schema);
export { CommentsModel, IComments };
