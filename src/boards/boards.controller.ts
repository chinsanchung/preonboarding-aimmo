/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { validate } from "../utils/joiValidate";
import Log from "../utils/debugger";
import { BoardService } from "./boards.service";
import createError from "../utils/createError";

export default class BoardController {
  private boardService = new BoardService();
  constructor() {
    this.create = this.create.bind(this);
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
      Log.info("BODY: ", createQuery);
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
}
