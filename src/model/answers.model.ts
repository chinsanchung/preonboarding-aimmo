import { Schema, model, Types } from "mongoose";

interface IAnswers {
  contents: string;
  user_id: Types.ObjectId;
  created_at: Date;
  deleted_at?: Date | null;
}

const schema = new Schema<IAnswers>(
  {
    contents: { type: String, default: "" },
    user_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at" } }
);

const AnswersModel = model<IAnswers>("answers", schema);

export { AnswersModel, IAnswers };
