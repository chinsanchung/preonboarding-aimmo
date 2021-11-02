/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response, NextFunction } from "express";
import { validate } from "../utils/joiValidate";
import { AnswersService } from "./answers.service";
import Joi from "joi";

export default class answersController {
  private answersService = new AnswersService();
  constructor() {
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.readAll = this.readAll.bind(this);
  }
  async create(req: Request, res: Response, next: NextFunction) {
    const bodySchema = Joi.object().keys({
      contents: Joi.string().required(),
    });
    const paramsSchema = Joi.object()
      .keys({
        comment_id: Joi.string().required(),
      })
      .unknown();
    try {
      validate(bodySchema, req.body);
      validate(paramsSchema, req.params);
      const { contents } = req.body;
      const { comment_id } = req.params;
      await this.answersService.writeAnswer(
        comment_id,
        // @ts-ignore
        req.user._id,
        contents
      );
      res.status(201).send({ message: "댓글을 생성했습니다." });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const paramsSchema = Joi.object()
      .keys({
        comment_id: Joi.string(),
        answersId: Joi.string(),
      })
      .unknown();
    try {
      validate(paramsSchema, req.params);
      const { comment_id, answersId } = req.params;
      await this.answersService.deleteAnswer(
        comment_id,
        answersId,
        // @ts-ignore
        req.user._id
      );
      res.send();
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async readAll(req: Request, res: Response, next: NextFunction) {
    const paramsSchema = Joi.object()
      .keys({
        comment_id: Joi.string().required(),
      })
      .unknown();
    try {
      validate(paramsSchema, req.params);
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const offset = req.query.page ? (Number(req.query.page) - 1) * limit : 0;
      const { comment_id } = req.params;
      const response = await this.answersService.AnswerList(
        comment_id,
        limit,
        offset
      );
      res.status(200).send(response);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
