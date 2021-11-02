/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response, NextFunction } from "express";
import Joi, { number } from "joi";
import { validate } from "../utils/joiValidate";
import bcrypt from "bcrypt";
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
      console.log("BODY: ", createQuery);
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
      const page: string = req.query.page as string;
      const title: string = req.query.title as string;
      const contents: string = req.query.contents as string;
      const valid = ["page", "title", "contents"];

      if (!page) {
        next(createError(403, "유효한 인수를 입력해주세요"));
      } else {
        if (parseInt(page) < 1) {
          next(createError(403, "유효한 인수를 입력해주세요"));
        } else {
          const response = await this.boardService.readAll(
            parseInt(page) - 1,
            title,
            contents
          );

          return res.status(200).send(response);
        }
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async readOne(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("ID: ", req.params.id);
      const board = await this.boardService.readOne(req.params.id);

      return res.status(200).send(board);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
