import { Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Group } from "./Group";
import { Split } from "./Split";
import { ApplicationUser } from "./ApplicationUser";

@ObjectType()
@Entity()
export class Transaction {
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
  message!: string;

  @Field()
  @Property({ type: "number" })
  amount!: number;

  @Field(() => ApplicationUser)
  @ManyToOne(() => ApplicationUser)
  owner!: ApplicationUser;

  @Field(() => Group)
  @ManyToOne(() => Group, {
    nullable: false,
  })
  groupRef: Group;

  @Field(() => [Split])
  @OneToMany(() => Split,(split)=>split.transactionRef)
  splitList: Split;

}
