// import { UserGroup } from "src/entities/UserGroup";
import { getUserFroUserId } from "../utilies/getUserFroimUserId";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Group } from "../entities/Group";
import { MyContext } from "../types";
@Resolver()
export class UserGroupResolver {
  @Mutation(() => Boolean)
  async createNewGroup(
    @Ctx() { em, request }: MyContext,
    @Arg("group_name") groupName: string
  ) {
    const user = await getUserFroUserId(request.session.userId, em);
    const group = em.create(Group, {
      group_name: groupName,
    });
    user.groups.add(group);
    user.owned_groups.add(group);
    await em.persistAndFlush(user);
    return true;
  }

  @Mutation(() => Boolean)
  async addNewMember(
    @Ctx() { em, request }: MyContext,
    @Arg("memberid") memberid: number,
    @Arg("groupid") groupid: number
  ) {
    const user = await getUserFroUserId(request.session.userId, em);
    if (user.groups.contains(em.getReference(Group, groupid))) {
      const newMember = await getUserFroUserId(memberid, em);
      await em.persistAndFlush(newMember);
      return true;
    } else {
      return false;
    }
  }
}
