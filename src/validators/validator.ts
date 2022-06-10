import { NextFunction, Request, Response } from 'express'

export default interface Validator {
  new: (req: Request, res: Response, next: NextFunction) => Promise<void>
  update: (req: Request, res: Response, next: NextFunction) => Promise<void>
}