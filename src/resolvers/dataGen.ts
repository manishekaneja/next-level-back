// import { Split } from "../entities/Split";
import { wrap } from "@mikro-orm/core";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { ApplicationUser } from "../entities/ApplicationUser";
import { Group } from "../entities/Group";
import { Split } from "../entities/Split";
import { Transaction } from "../entities/Transaction";
import { MyContext } from "../types";

@Resolver()
export class DataGenResolver {
  @Mutation(() => Boolean)
  async genrateDataForUse(@Ctx() { em }: MyContext) {
    const users: Array<ApplicationUser> = [];
    for (let idx of [1, 2, 3, 4, 5]) {
      users.push(
        em.create(ApplicationUser, {
          firstname: `Manish${idx}`,
          lastname: `Aneja${idx}`,
          email: `manish${idx}@gmail.com`,
          password: "123123123",
          username: "manish_x2" + idx,
        })
      );
    }

    em.persist(users);
    let idx = 100;
    const group = em.create(Group, {
      name: "Group" + idx,
      createdBy: wrap(users[0]).toReference
    });
    users[0].groupList.add(group);
    await em.flush();
    return true;
  }

  @Mutation(() => Boolean)
  async clean(@Ctx() { em }: MyContext) {
    await em.nativeDelete(Transaction, {});
    await em.nativeDelete(Group, {});
    await em.nativeDelete(ApplicationUser, {});
    await em.nativeDelete(Split, {});

    return true;
  }

  @Query(() => [Group])
  getAllGroups(@Ctx() { em }: MyContext) {
    return em.find(Group, {}, ["transactionList", "memberList"]);
  }

  @Query(() => [ApplicationUser])
  async allUsers(@Ctx() { em }: MyContext) {
    return await em.find(ApplicationUser, {}, [
      "groupList",
      "transactionList",
      "splitList",
    ]);
  }

  @Query(() => [Transaction])
  getAllTransactions(@Ctx() { em }: MyContext) {
    return em.find(Transaction, {}, ["owner", "groupRef", "splitList"]);
  }



  @Query(()=>[Split])
  async getTransactionSummary(@Ctx() { em }:MyContext,
  @Arg("groupid") groupid: number
  ){
    const group = await em.findOne(Group,{
      id:groupid
    })
    group?.transactionList.init();
    console.log()
    return em.find(Split,{
    transactionRef:{
        $in:(await group?.transactionList.loadItems())
    }  
    })
  }
}
