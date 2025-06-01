import { Types } from "mongoose";

export interface UserCollection {
  name: string;
  books: Types.ObjectId[];
}