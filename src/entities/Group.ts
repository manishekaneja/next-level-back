import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Transaction } from "./Transaction";
import { User } from "./User";

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

  @Field(() => User)
  @ManyToOne(() => User)
  created_by!: User;

  @Field(() => [Transaction])
  @OneToMany(() => Transaction, (group) => group.belong_to, {
    orphanRemoval: true,
  })
  transactions_made = new Collection<Transaction>(this);

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.groups)
  members = new Collection<User>(this);
}
