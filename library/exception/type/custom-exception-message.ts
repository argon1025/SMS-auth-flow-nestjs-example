import { CountryCode } from 'library/constant/constant';

export type ExceptionMessageInterface = Partial<
  Record<typeof CountryCode[keyof typeof CountryCode], string>
>;

export interface CustomExceptionResponseInterface {
  statusCode: number;
  location: string;
  message: ExceptionMessageInterface | undefined;
}

export const isCustomExceptionMessageInterface = (
  object: any,
): object is ExceptionMessageInterface => {
  if (!object) return false;
  try {
    Object.keys(object).forEach((key) => {
      if (!(key in CountryCode)) throw new Error();
    });
    return true;
  } catch (error) {
    return false;
  }
};
