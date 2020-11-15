import { Connection, IDatabaseDriver, EntityManager } from '@mikro-orm/core';
import { Request, Response } from 'express';

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  request: Request & { session: Express.Session };
  response: Response;
};
