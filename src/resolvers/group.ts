// import { UserGroup } from "src/entities/UserGroup";
import { UserIdList } from "../types/UserResponse";
import { Arg, Ctx, Field, Mutation, Resolver } from "type-graphql";
import { ApplicationUser } from "../entities/ApplicationUser";
import { Group } from "../entities/Group";
import { MyContext } from "../types";
import { getUserFroUserId } from "../utilies/getUserFroimUserId";
@Resolver()
export class UserGroupResolver {
  @Mutation(() => Boolean)
  async createNewGroup(
    @Ctx() { em, request }: MyContext,
    @Arg("groupName") groupName: string,
    @Arg("memberList") list: @Field(type => [Int])
  ) {
    const user = await getUserFroUserId(request.session.userId, em);
    const memberObjectList = await em.find(
      ApplicationUser,
      {
        id: {
          $in: list,
        },
      },
      ["groupList"]
    );
    console.log(memberObjectList);
    const group = em.create(Group, {
      group_name: groupName,
    });
    user.groupList.add(group);
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
    if (user.groupList.contains(em.getReference(Group, groupid))) {
      const newMember = await getUserFroUserId(memberid, em);
      await em.persistAndFlush(newMember);
      return true;
    } else {
      return false;
    }
  }
}
