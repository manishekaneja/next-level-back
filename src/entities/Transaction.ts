import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Group } from "./Group";
import { User } from "./User";

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
  created_at = new Date();



  @Field()
  @Property({ type: "text" })
  message!: string;

  @Field()
  @Property({ type: "number" })
  amount!: number;


  @Field(() => User)
  @ManyToOne(() => User)
  done_by!: User;

  @Field(() => Group)
  @ManyToOne(() => Group, {
    nullable: false,
  })
  belong_to: Group;
}
