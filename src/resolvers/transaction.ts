// import { UserGroup } from "src/entities/UserGroup";
import { Transaction } from "../entities/Transaction";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Group } from "../entities/Group";
import { User } from "../entities/User";
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
    const user = await em.findOneOrFail(User, { id: userid });
    const group = await em.findOneOrFail(Group, { id: groupid });
    const transaction = em.create(Transaction, {
      message: message,
      amount: amount,
    });
    user.transactions_made.add(transaction);
    group.transactions_made.add(transaction);
    await em.persistAndFlush(user);
    return true;
  }

  @Mutation(() => Boolean)
  async addNewMember(
    @Ctx() { em }: MyContext,
    @Arg("userid") userid: number,
    @Arg("groupid") groupid: number
  ) {
    const user = await em.findOneOrFail(User, { id: userid });
    user.groups.add(em.getReference(Group, groupid));
    await em.persistAndFlush(user);
    return true;
  }
}
