import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/environment';
import pool from '../config/mysql';

export interface IUser {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  age?: number;
  gender?: 'male' | 'female' | 'others';
  about?: string;
  photo?: string;
  skills?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  age?: number;
  gender?: 'male' | 'female' | 'others';
  about?: string;
  photo?: string;
  skills?: string[];
}

export interface LoginData {
  email: string;
  password: string;
}

class UserModel {
  // Create a new user
  static async create(userData: CreateUserData): Promise<IUser> {
    const connection = await pool.getConnection();
    
    try {
      // Hash the password
      const passwordHash = await bcrypt.hash(userData.password, 10);
      
      const [result] = await connection.execute(
        `INSERT INTO users (firstName, lastName, email, password, age, gender, about, photo, skills) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.firstName,
          userData.lastName || null,
          userData.email,
          passwordHash,
          userData.age || null,
          userData.gender || null,
          userData.about || config.defaultUserAbout,
          userData.photo || config.defaultUserPhoto,
          userData.skills ? JSON.stringify(userData.skills) : null,
        ]
      );

      const userId = (result as any).insertId;
      const user = await this.findById(userId);
      if (!user) {
        throw new Error('Failed to create user');
      }
      return user;
    } finally {
      connection.release();
    }
  }

  // Find user by ID
  static async findById(id: number): Promise<IUser | null> {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );

      const users = rows as IUser[];
      if (users.length === 0) return null;

      const user = users[0];
      return {
        ...user,
        skills: user.skills ? JSON.parse(user.skills as any) : [],
      };
    } finally {
      connection.release();
    }
  }

  // Find user by email
  static async findByEmail(email: string): Promise<IUser | null> {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      const users = rows as IUser[];
      if (users.length === 0) return null;

      const user = users[0];
      return {
        ...user,
        skills: user.skills ? JSON.parse(user.skills as any) : [],
      };
    } finally {
      connection.release();
    }
  }

  // Find users by gender (for feed)
  static async findByGender(gender: string, excludeIds: number[] = [], limit: number = 50, skip: number = 0): Promise<IUser[]> {
    const connection = await pool.getConnection();
    
    try {
      let query = 'SELECT * FROM users WHERE gender = ?';
      const params: any[] = [gender];

      if (excludeIds.length > 0) {
        query += ' AND id NOT IN (' + excludeIds.map(() => '?').join(',') + ')';
        params.push(...excludeIds);
      }

      query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
      params.push(limit, skip);

      const [rows] = await connection.execute(query, params);
      const users = rows as IUser[];

      return users.map(user => ({
        ...user,
        skills: user.skills ? JSON.parse(user.skills as any) : [],
      }));
    } finally {
      connection.release();
    }
  }

  // Update user
  static async update(id: number, updateData: Partial<IUser>): Promise<IUser | null> {
    const connection = await pool.getConnection();
    
    try {
      const fields = Object.keys(updateData).filter(key => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt');
      const values = fields.map(field => updateData[field as keyof IUser]);

      if (fields.length === 0) return await this.findById(id);

      const query = `UPDATE users SET ${fields.map(field => `${field} = ?`).join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
      values.push(id);

      await connection.execute(query, values);
      return await this.findById(id);
    } finally {
      connection.release();
    }
  }

  // Delete user
  static async delete(id: number): Promise<boolean> {
    const connection = await pool.getConnection();
    
    try {
      const [result] = await connection.execute(
        'DELETE FROM users WHERE id = ?',
        [id]
      );

      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  // Validate password
  static async validatePassword(userId: number, passwordInput: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user) return false;

    return await bcrypt.compare(passwordInput, user.password);
  }

  // Generate JWT token
  static async generateJWT(userId: number): Promise<string> {
    return jwt.sign({ _id: userId }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    } as any);
  }

  // Verify JWT token
  static async verifyJWT(token: string): Promise<{ _id: number } | null> {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { _id: number };
      return decoded;
    } catch (error) {
      return null;
    }
  }
}

export default UserModel; 