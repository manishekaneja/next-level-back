import { Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Group } from "../entities/Group";
import { Transaction } from "../entities/Transaction";
import { User } from "../entities/User";
import { MyContext } from "../types";

@Resolver()
export class DataGenResolver {
  @Mutation(() => Boolean)
  async genrateDataForUse(@Ctx() { em }: MyContext) {
    const users: Array<User> = [];
    for (let idx of [1, 2, 3, 4, 5]) {
      users.push(
        em.create(User, {
          first_name: `Manish${idx}`,
          last_name: `Aneja${idx}`,
          email:`manish${idx}@gmail.com`,
          password: "123123123",
          username: "manish_x2" + idx,
        })
      );
    }

    em.persist(users);
    let idx = 100;
    // const groups: Array<UserGroup> = [];
    // // for (let idx of [1, 2, 3, 4, 5]) {
    // groups.push(
    // );

    const group = em.create(Group, {
      name: "Group" + idx,
    });

    // em.create(UserGroup, {
    //   group_name: "Group" + idx,
    // });
    users[0].groups.add(group);
    users[0].owned_groups.add(group);

    // // groups[idx - 1].created_by// }
    // console.log(groups);
    // em.persist(groups);

    await em.flush();
    return true;
  }

  @Mutation(() => Boolean)
  async clean(@Ctx() { em }: MyContext) {
    await em.nativeDelete(Transaction, {});
    const group = await em.nativeDelete(Group, {});
    const user = await em.nativeDelete(User, {});

    console.log({ group: group, user });

    return true;
  }

  @Query(() => [Group])
  getAllGroups(@Ctx() { em }: MyContext) {
    return em.find(Group, {}, ["created_by", "members", "transactions_made"]);
  }

  @Query(() => [User])
  async allUsers(@Ctx() { em }: MyContext) {
    return await em.find(User, {}, [
      "groups",
      "groups.members",
      "transactions_made",
    ]);
  }

  @Query(() => [Transaction])
  getAllTransactions(@Ctx() { em }: MyContext) {
    return em.find(Transaction, {}, ["done_by", "belong_to"]);
  }
}
