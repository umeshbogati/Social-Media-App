export interface IUser {
  _id?: string | any; // Allow ObjectId
  username: string;
  name: string;
  email: string;
  password?: string; // Optional for responses
  address?: string | null;
  phone?: string | null;
  profilePicture?: string | null;
  role: "user" | "admin";
  timestamp?: Date;
  __v?: number; // Mongoose version key
}

export interface IPost {
  _id?: string | any;
  userId: string | any;
  description: string;
  image?: string | null | undefined;
  likes: any[];
  comments: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IComment {
  userId: string | any;
  text: string;
  _id?: string | any;
}

export interface IAuthRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest extends IAuthRequest {
  username: string;
  name: string;
}

export interface ICreatePostRequest {
  description: string;
}

export interface IEditPostRequest {
  description?: string;
}

export interface ICommentRequest {
  text: string;
}
