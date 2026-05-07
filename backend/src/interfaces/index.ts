//user interface

export interface IUser {
  _id: string;
  username: string;
  name: string;
  email: string;
  password?: string;

  address?: string | null;
  phone?: string | null;
  profilePicture?: string | null;

  role: "user" | "admin";
  refreshToken?: string | null;

  createdAt: string;
  updatedAt: string;
}
//comment interface
export interface IComment {
  _id: string;
  text: string;

  user: {
    _id: string;
    username: string;
    profilePicture?: string | null;
  };

  createdAt: string;
}

//post interface

export interface IPost {
  _id: string;

  user: {
    _id: string;
    username: string;
    name?: string;
    profilePicture?: string | null;
  };

  description: string;
  image?: string | null;

  likes: string[];

  comments: IComment[];

  createdAt: string;
  updatedAt: string;
}

//request interfaces

export interface IAuthRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest extends IAuthRequest {
  username: string;
  name: string;
}

// POST REQUEST

export interface ICreatePostRequest {
  description: string;
}

export interface IEditPostRequest {
  description?: string;
}

export interface ICommentRequest {
  text: string;
}