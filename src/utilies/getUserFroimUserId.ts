import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { ApplicationUser } from "../entities/ApplicationUser";

export async function getUserFroUserId(
  userid: number,
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
): Promise<ApplicationUser> {
  if (!userid) {
    throw new Error("Expected User.id, but received Undefined");
  }
  const user = await em.findOneOrFail(ApplicationUser, {
    id: userid,
  },["groupList"]);
  return user;
}
