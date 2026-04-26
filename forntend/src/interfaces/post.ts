// filepath: src/interfaces/post.ts
export interface IPost {
  _id: string;
  userId: {
    _id: string;
    username: string;
    name?: string;
    profilePicture?: string;
  };
  description: string;
  image?: string;
  likes: string[];
  comments: IComment[];
  createdAt: string;
  updatedAt?: string;
}

export interface IComment {
  _id: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface ICreatePostData {
  description: string;
  image?: File;
}

export interface IEditPostData {
  description: string;
}
