import { ObjectSchema } from "joi";
import createHttpError from "http-errors";

export const validate = (schema: ObjectSchema<any>, data: any): void => {
  const { value, error } = schema.validate(data);
  if (error != null) {
    throw createHttpError(
      400,
      `필수값이 없습니다. ${error.details[0].path.join("")}`
    );
  }
};
