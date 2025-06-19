import { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  age?: number;
  gender?: 'male' | 'female' | 'others';
  about?: string;
  photo?: string;
  skills?: string[];
  getJWT(): Promise<string>;
  validatePassword(passwordInput: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConnectionRequest extends Document {
  _id: Types.ObjectId;
  fromUserId: Types.ObjectId;
  toUserId: Types.ObjectId;
  fromUserName?: string;
  toUserName?: string;
  status: 'ignore' | 'accepted' | 'rejected' | 'interested';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
  cookies: {
    token?: string;
    [key: string]: any;
  };
  body: any;
  params: any;
  query: any;
}

export interface SignupData {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  age?: number;
  gender?: 'male' | 'female' | 'others';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface EditProfileData {
  firstName?: string;
  lastName?: string;
  gender?: 'male' | 'female' | 'others';
  age?: number;
  about?: string;
  photo?: string;
  skills?: string[];
}

export interface PasswordUpdateData {
  oldPassword: string;
  newPassword: string;
}

export interface JwtPayload {
  _id: string;
  iat?: number;
  exp?: number;
} 