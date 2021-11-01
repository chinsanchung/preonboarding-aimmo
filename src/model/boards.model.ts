import { Schema, model, Types } from "mongoose";

interface IViewCnt {
  member_id: Types.ObjectId;
  view_date: Date;
}
interface IBoard {
  title: string;
  contents: string;
  category: string;
  view_cnt: IViewCnt[];
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

const viewCntSchema = new Schema<IViewCnt>(
  {
    member_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    view_date: { type: Date, required: true },
  },
  { _id: false }
);

const schema = new Schema<IBoard>({
  title: { type: String, required: true },
  contents: { type: String, required: true },
  category: { type: String, required: true },
  view_cnt: { type: [viewCntSchema], default: [] },
  created_at: { type: Date, required: true },
  updated_at: { type: Date },
  deleted_at: { type: Date },
});

const BoardModel = model<IBoard>("boards", schema);

export { BoardModel, IBoard };
