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
import { Transaction } from "./Transaction";

@ObjectType()
@Entity()
export class User {
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
  first_name!: string;

  @Field()
  @Property({ type: "text" })
  last_name!: string;

  @Field()
  @Property({ type: "text", unique: true })
  username!: string;

  @Field()
  @Property({ type: "text" })
  email!: string;


  @Property({ type: "text" })
  password!: string;

  @Field(() => [Group])
  @OneToMany(() => Group, (group) => group.created_by, {
    orphanRemoval: true,
  })
  owned_groups = new Collection<Group>(this);

  @Field(() => [Group])
  @ManyToMany(() => Group, (group) => group.members, {
    owner: true,
    default: [],
    nullable: false,
  })
  groups = new Collection<Group>(this);

  @Field(() => [Transaction])
  @OneToMany(() => Transaction, (group) => group.done_by, {
    orphanRemoval: true,
  })
  transactions_made = new Collection<Transaction>(this);
}
