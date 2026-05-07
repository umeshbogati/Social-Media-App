export interface Comment {
  _id?: string;
  user: {
    _id: string;
    username: string;
  };
  text: string;
}

export interface Post {
  _id: string;
  user: {
    _id: string;
    username: string;
    name?: string;
    profilePicture?: string;
  } | string;

  description: string;
  image?: string;

  likes: (string | { _id: string })[];

  comments: Comment[];

  createdAt?: string; 
}