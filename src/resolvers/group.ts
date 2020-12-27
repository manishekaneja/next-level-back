// import { UserGroup } from "src/entities/UserGroup";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { ApplicationUser } from "../entities/ApplicationUser";
import { Group } from "../entities/Group";
import { MyContext } from "../types";
import { CreateGroupInputType } from "../types/UserResponse";
import { getUserFroUserId } from "../utilies/getUserFroimUserId";
@Resolver()
export class UserGroupResolver {
  @Mutation(() => ApplicationUser)
  async createNewGroup(
    @Ctx() { em, request }: MyContext,
    @Arg("data") { groupName, membersIdList }: CreateGroupInputType
  ) {
    const userSet: Set<number> = new Set(membersIdList);
    userSet.add(request.session.userId);
    const user = await getUserFroUserId(request.session.userId, em);
    const memberObjectList = await em.find(
      ApplicationUser,
      {
        id: {
          $in: [...userSet],
        },
      },
      ["groupList"]
    );
    const group = em.create(Group, {
      name: groupName,
    });
    memberObjectList.forEach((member: ApplicationUser) => {
      member.groupList.add(group);
    });
    em.persist(group);
    await em.persistAndFlush(memberObjectList);
    return user;
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

  @Query(() => Group, {
    nullable: true,
  })
  async fetchGroupById(
    @Ctx() { em, request }: MyContext,
    @Arg("groupId") groupId: number
  ) {
    const user = await getUserFroUserId(request.session.userId, em);
    if (groupId < 0 || !user) {
      return null;
    }
    const group = await em.findOneOrFail(
      Group,
      {
        id: groupId,
      },
      ["memberList", "transactionList", "transactionList.owner"]
    );
    return group;
  }
}
