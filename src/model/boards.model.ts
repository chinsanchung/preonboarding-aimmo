import { Schema, model, Types } from "mongoose";

interface IViewCnt {
  user_id: Types.ObjectId;
  view_date: Date;
}
interface IBoard {
  title: string;
  contents: string;
  category: string;
  view_cnt: IViewCnt[];
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

const viewCntSchema = new Schema<IViewCnt>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
  },
  { _id: false, timestamps: { createdAt: "view_date" } }
);

const schema = new Schema<IBoard>(
  {
    title: { type: String, required: true },
    contents: { type: String, required: true },
    category: { type: String, required: true },
    view_cnt: { type: [viewCntSchema], default: [] },
    deleted_at: { type: Date },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const BoardModel = model<IBoard>("boards", schema);

export { BoardModel, IBoard };
