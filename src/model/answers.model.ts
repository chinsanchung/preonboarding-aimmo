import { Schema, model, Types } from "mongoose";

interface IAnswersArray {
  member_id: Types.ObjectId;
  contents: string;
}
interface IAnswers {
  comment_id: Types.ObjectId;
  answers_array: IAnswersArray[];
}

const answersArraySchema = new Schema<IAnswersArray>({
  member_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
  contents: { type: String, default: "" },
});

const schema = new Schema<IAnswers>({
  comment_id: { type: Schema.Types.ObjectId, ref: "comments", required: true },
  answers_array: { type: [answersArraySchema], default: [] },
});

const AnswersModel = model<IAnswers>("answers", schema);

export { AnswersModel, IAnswers };
