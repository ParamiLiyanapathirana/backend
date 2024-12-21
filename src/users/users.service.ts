import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signUp(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ name, email, password: hashedPassword });
    return newUser.save();
  }

  async signIn(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async bulkCreate(users: any[]) {
    const createdUsers = users.map(user => ({
      name: user.name,
      email: user.email,
      password: user.password, // Assuming passwords are already hashed in the input
    }));
    return this.userModel.insertMany(createdUsers);
  }

  async listUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const users = await this.userModel.find().skip(skip).limit(limit);
    const totalUsers = await this.userModel.countDocuments();
    return {
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
    }
  }

  async searchUsers(query: string) {
    const regex = new RegExp(query, 'i'); // Case-insensitive search
    return this.userModel.find({
      $or: [{ name: regex }, { email: regex }],
    });
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (user && user.company) {
      const remainingUsers = await this.userModel.countDocuments({ company: user.company });
      if (remainingUsers === 0) {
        await this.userModel.findByIdAndDelete(user.company); 
      }
    }
  }
  

}

