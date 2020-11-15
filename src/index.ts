import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import redis from 'redis';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import {
  __app_server_ip__,
  __cookie_name__,
  __port__,
  __prod__,
} from './constants';
import mikroOrmConfig from './mikro-orm.config';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

const main = async (): Promise<void> => {
  const orm: MikroORM = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const appServer = express();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  appServer.use(
    session({
      name: __cookie_name__,
      store: new RedisStore({
        client: redisClient,
        disableTouch: false,
        disableTTL: true,
      }),
      resave: false,
      secret: 'keyboard cat',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__,
      },
      saveUninitialized: false,
    })
  );

  appServer.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

  const apolloServer: ApolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => {
      return {
        em: orm.em,
        request: req,
        response: res,
      };
    },
  });
  apolloServer.applyMiddleware({
    app: appServer,
    cors: {
      origin: 'http://localhost:3000',
    },
  });
  appServer.listen(__port__, __app_server_ip__, function (): void {
    console.log(`Server running @ ${__port__}`);
  });
};

// async function initializeORM(): Promise<MikroORM> {
//   const orm: MikroORM = await MikroORM.init(mikroOrmConfig);
//   await orm.getMigrator().up();
//   // const post = orm.em.create(Post, { title: "My First Post" });
//   // await orm.em.persistAndFlush(post);
//   return orm;
// }

// async function initializeApolloServer(orm: MikroORM): Promise<ApolloServer> {
//   return new ApolloServer({
//     schema: await buildSchema({
//       resolvers: [PostResolver, UserResolver],
//       validate: false,
//     }),
//     context: (
//       request: Request & { session: Express.Session },
//       response: Response
//     ): MyContext => ({
//       em: orm.em,
//       request,
//       response,
//     }),
//   });
// }

// function initializeAppServer(): Express {
//   const app: Express = express();

//   app.listen(__port__, __app_server_ip__, function (): void {
//     console.log(`Server running @ ${__port__}`);
//   });
//   return app;
// }

main().catch((error: Error): void => {
  console.log(error);
});
