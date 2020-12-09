import { MikroORM } from "@mikro-orm/core";
import path from "path";
import {
  __database_name__,
  __database_password__,
  __database_user__,
  __prod__,
} from "./constants";
import { Group } from "./entities/Group";
import { Post } from "./entities/Post";
import { Transaction } from "./entities/Transaction";
import { User } from "./entities/User";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User, Group, Transaction],
  clientUrl: "postgresql://postgres-db:5432",
  dbName: __database_name__,
  user: __database_user__,
  password: __database_password__,
  type: "postgresql",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
