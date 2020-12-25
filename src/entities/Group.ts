import {
  Collection,
  Entity,
  ManyToMany,

  OneToMany,
  PrimaryKey,
  Property
} from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { ApplicationUser } from "./ApplicationUser";
import { Transaction } from "./Transaction";

@ObjectType()
@Entity()
export class Group {
  @Field()
  @PrimaryKey({
    type: "number",
    unique: true,
  })
  id!: number;

  @Field(() => String)
  @Property({ type: "date", default: "NOW()" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text" })
  name!: string;

  @Field(() => [Transaction])
  @OneToMany(() => Transaction, (transaction) => transaction.groupRef, {
    orphanRemoval: true,
  })
  transactionList = new Collection<Transaction>(this);

  @Field(() => [ApplicationUser])
  @ManyToMany(() => ApplicationUser, (user) => user.groupList)
  memberList = new Collection<ApplicationUser>(this);
}
