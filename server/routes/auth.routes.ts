import {Request, Response} from "express";
import {AuthService} from "../services/auth.service";

const service = new AuthService();

export function login(req: Request, res: Response) {
  try {
    const user = service.login(req.body.email, req.body.password);
    res.json(user);
  } catch (e: any) {
    res.status(403).json({message: e.message});
  }
}