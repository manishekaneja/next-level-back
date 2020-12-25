import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Group } from "./Group";
import { Split } from "./Split";
import { Transaction } from "./Transaction";

@ObjectType()
@Entity()
export class ApplicationUser {
  @Field()
  @PrimaryKey({
    unique: true,
    type: "number",
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
  firstname!: string;

  @Field()
  @Property({ type: "text" })
  lastname!: string;

  @Field()
  @Property({ type: "text", unique: true })
  username!: string;

  @Field()
  @Property({ type: "text" })
  email!: string;

  @Property({ type: "text" })
  password!: string;

  @Field(() => [Group])
  @ManyToMany(() => Group, (group) => group.memberList, {
    owner: true,
    default: [],
    nullable: false,
  })
  groupList = new Collection<Group>(this);

  @Field(() => [Transaction])
  @OneToMany(() => Transaction, (transaction) => transaction.owner, {
    orphanRemoval: true,
  })
  transactionList = new Collection<Transaction>(this);

  @Field(() => [Split])
  @OneToMany(() => Split, (split) => split.onwer, {
    orphanRemoval: true,
  })
  splitList = new Collection<Split>(this);
}
