import { compare } from 'bcryptjs';
import {  request, Request , Response} from 'express';
import { sign } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';

class SessionController{
    async create(request: Request, response: Response) {
    const { username, password } = request.body;

    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findOne(
      { username },
      { relations: ["roles"] }
    );

    if (!user) {
      return response.status(400).json({ error: "Usuario não cadastrado!" });
    };

    const comparaPasword = await compare(password, user.password);

    if (!comparaPasword) {
      return response
        .status(400)
        .json({ error: "Incorreto senha ou usuario" });
    }
    
    const token = sign({}, process.env.APP_SECRET as string, {
        subject: user.id,
        expiresIn: "1d",
      });

      return response.json({
          token,
          user
        });
    }
}

export default new SessionController();