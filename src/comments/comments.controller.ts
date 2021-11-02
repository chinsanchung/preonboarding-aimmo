/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response, NextFunction } from "express";
import { validate } from "../utils/joiValidate";
import { CommentsService } from "./comments.service";
import Joi from "joi";
import { Types } from "mongoose";
import createError from "../utils/createError";
import {} from "mongoose";

export default class commentsController {
  private commentsService = new CommentsService();
  constructor() {
    this.create = this.create.bind(this);
  }
  async create(req: Request, res: Response, next: NextFunction) {
    const bodySchema = Joi.object().keys({
      contents: Joi.string().required(),
    });
    const paramsSchema = Joi.object().keys({
      board_id: Joi.string().required(),
    });
    try {
      validate(bodySchema, req.body);
      validate(paramsSchema, req.params);
      const { contents } = req.body;
      const { board_id } = req.params;
      await this.commentsService.writeComment(
        board_id,
        // @ts-ignore
        req.user._id,
        contents
      );
      res.status(201).send({ message: "댓글을 생성했습니다."});
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
