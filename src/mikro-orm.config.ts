import { Post } from './entities/Post';
import { User } from './entities/User';

import {
  __prod__,
  __database_name__,
  __database_user__,
  __database_password__,
} from './constants';
import { MikroORM } from '@mikro-orm/core';
import path from 'path';
export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: __database_name__,
  user: __database_user__,
  password: __database_password__,
  type: 'postgresql',
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
