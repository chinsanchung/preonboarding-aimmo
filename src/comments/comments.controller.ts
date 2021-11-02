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
  }
  async create(req: Request, res: Response, next: NextFunction) {
    const bodySchema = Joi.object().keys({
      contents: Joi.string().required(),
    });
    const paramsSchema = Joi.object().keys({
      boardsId: Joi.string(),
    });
    try {
      validate(bodySchema, req.body);
      validate(paramsSchema, req.params);
      const { contents } = req.body;
      await this.commentsService.writeComment(
        new Types.ObjectId("6180a767248e314deac39bec"),
        // @ts-ignore
        req.user._id,
        contents
      );
      res.send();
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const paramsSchema = Joi.object().keys({
      boardsId: Joi.string(),
      coommentsId: Joi.string(),
    });
    try {
      validate(paramsSchema, req.params);
      await this.commentsService.deleteComment(
        new Types.ObjectId("6180a767248e314deac39bec"),
        new Types.ObjectId("6180b14035a2b7348dfc95f5")
      );
      res.send()
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
