import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { User } from "../entities/User";

export async function getUserFroUserId(
  userid: number,
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
): Promise<User> {
  if (!userid) {
    throw new Error("Expected User.id, but received Undefined");
  }
  const user = await em.findOneOrFail(User, {
    id: userid,
  });
  return user;
}
