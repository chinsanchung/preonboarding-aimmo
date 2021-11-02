/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { validate } from "../utils/joiValidate";
import { BoardService } from "./boards.service";
import createError from "../utils/createError";

export default class BoardController {
  private boardService = new BoardService();
  constructor() {
    this.create = this.create.bind(this);
    this.readOne = this.readOne.bind(this);
    this.readAll = this.readAll.bind(this);
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
      validate(schema, req.body);
      const board = await this.boardService.create(createQuery);

      return res
        .status(201)
        .send({ message: "게시글을 생성했습니다.", data: board });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async readAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = req.query.page ? (Number(req.query.page) - 1) * limit : 0;
      const title: string = req.query.title as string;
      const contents: string = req.query.contents as string;
      // const valid = ["page", "title", "contents"];
      const response = await this.boardService.readAll(
        title,
        contents,
        limit,
        offset
      );

      return res.status(200).send(response);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async readOne(req: Request, res: Response, next: NextFunction) {
    const paramsSchema = Joi.object().keys({
      board_id: Joi.string(),
    });
    try {
      validate(paramsSchema, req.params);
      const { board_id } = req.params;
      const board = await this.boardService.readOne(board_id);

      return res.status(200).send(board);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
