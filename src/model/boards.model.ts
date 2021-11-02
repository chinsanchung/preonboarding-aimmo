import { Schema, model, Types } from "mongoose";

interface IViewCnt {
  user_id: Types.ObjectId;
  view_date: Date;
}
interface IBoard {
  user_id: Types.ObjectId;
  title: string;
  contents: string;
  category: string;
  view_cnt: IViewCnt[];
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
  comments_array: Schema.Types.ObjectId[];
}

const viewCntSchema = new Schema<IViewCnt>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
  },
  { _id: false, timestamps: { createdAt: "view_date" } }
);

const schema = new Schema<IBoard>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    title: { type: String, required: true },
    contents: { type: String, required: true },
    category: { type: String, required: true },
    view_cnt: { type: [viewCntSchema], default: [] },
    deleted_at: { type: Date },
    comments_array: {
      type: [Schema.Types.ObjectId],
      ref: "comments",
      default: [],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const BoardModel = model<IBoard>("boards", schema);

export { BoardModel, IBoard };
