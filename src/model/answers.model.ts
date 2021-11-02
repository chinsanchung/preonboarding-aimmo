import { Schema, model, Types } from "mongoose";

interface IAnswersArray {
  member_id: Types.ObjectId;
  contents: string;
  created_at: Date;
  deleted_at?: Date;
}
interface IAnswers {
  comment_id: Types.ObjectId;
  answers_array: IAnswersArray[];
}

const answersArraySchema = new Schema<IAnswersArray>(
  {
    member_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    contents: { type: String, default: "" },
    deleted_at: { type: Date },
  },
  { timestamps: { createdAt: "created_at" } }
);

const schema = new Schema<IAnswers>({
  comment_id: { type: Schema.Types.ObjectId, ref: "comments", required: true },
  answers_array: { type: [answersArraySchema], default: [] },
});

const AnswersModel = model<IAnswers>("answers", schema);

export { AnswersModel, IAnswers };
