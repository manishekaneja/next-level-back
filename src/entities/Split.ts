import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { ApplicationUser } from "./ApplicationUser";
import { Transaction } from './Transaction';

@ObjectType()
@Entity()
export class Split {
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
  @Property({ type: "number" })
  splitAmount!: number;

  @Field(() => ApplicationUser)
  @ManyToOne(() => ApplicationUser)
  onwer!: ApplicationUser;

  @Field(() => Transaction)
  @ManyToOne(() => Transaction, {
    nullable: false,
  })
  transactionRef: Transaction;
}
