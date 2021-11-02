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
    this.delete = this.delete.bind(this);
    this.readAll = this.readAll.bind(this);
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
      res.status(201).send({ message: "댓글을 생성했습니다." });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const paramsSchema = Joi.object().keys({
      board_id: Joi.string(),
      coommentsId: Joi.string(),
    });
    try {
      validate(paramsSchema, req.params);
      const { board_id, coommentsId } = req.params;
      await this.commentsService.deleteComment(
        board_id,
        coommentsId,
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
    const paramsSchema = Joi.object().keys({
      board_id: Joi.string().required(),
    });
    try {
      validate(paramsSchema, req.params);
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const offset = req.query.page ? (Number(req.query.page) - 1) * limit : 0;
      const { board_id } = req.params;
      const response = await this.commentsService.commentList(
        board_id,
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
