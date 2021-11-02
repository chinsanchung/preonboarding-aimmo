/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { validate } from "../utils/joiValidate";
import Log from "../utils/debugger";
import { BoardService } from "./boards.service";

export default class BoardController {
  private boardService = new BoardService();
  constructor() {
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object()
      .keys({
        title: Joi.string().required(),
        contents: Joi.string().required(),
        category: Joi.string().required(),
      })
      .unknown();
    try {
      const createQuery = {
        ...req.body,
        //@ts-ignore
        user_id: req.user._id,
      };
      // console.log("BODY: ", createQuery);
      validate(schema, req.body);
      const board = await this.boardService.create(createQuery);

      return res
        .status(201)
        .send({ message: "게시글을 생성했습니다.", data: board });
    } catch (error) {
      Log.error(error);
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { board_id } = req.params;
    try {
      await this.boardService.update({
        //@ts-ignore
        user_id: req.user._id,
        board_id,
        updateQuery: req.body,
      });
      return res.status(201).send({ message: "수정을 완료했습니다." });
    } catch (error) {
      next(error);
    }
  }
}
