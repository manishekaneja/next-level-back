// import { UserGroup } from "src/entities/UserGroup";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { ApplicationUser } from "../entities/ApplicationUser";
import { Group } from "../entities/Group";
import { Split } from "../entities/Split";
import { Transaction } from "../entities/Transaction";
import { MyContext } from "../types";
@Resolver()
export class TransactionResolver {
  @Mutation(() => Boolean)
  async addNewTransaction(
    @Ctx() { em }: MyContext,
    @Arg("message") message: string,
    @Arg("amount") amount: number,
    @Arg("userid") userid: number,
    @Arg("groupid") groupid: number
  ) {
    const user = await em.findOneOrFail(ApplicationUser, { id: userid });
    const group = await em.findOneOrFail(Group, { id: groupid });
    const split = em.create(Split,{
      onwer:em.getReference(ApplicationUser,user.id),
      splitAmount:amount,      
    })

    group.memberList.init();
    console.log(">>>>",group.memberList)
    const transaction = em.create(Transaction, {
      message: message,
      amount: amount,
      splitList:[split]
    });
    user.transactionList.add(transaction);
    group.transactionList.add(transaction);
    await em.persistAndFlush(user);
    return true;
  }

  @Mutation(() => Boolean)
  async addNewMember(
    @Ctx() { em }: MyContext,
    @Arg("userid") userid: number,
    @Arg("groupid") groupid: number
  ) {
    const user = await em.findOneOrFail(ApplicationUser, { id: userid });
    user.groupList.add(em.getReference(Group, groupid));
    await em.persistAndFlush(user);
    return true;
  }
}
