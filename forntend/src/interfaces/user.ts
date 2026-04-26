// filepath: src/interfaces/user.ts
export interface IUser {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  coverPicture?: string;
  followers?: string[];
  following?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}
