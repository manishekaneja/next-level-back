import { Field, InputType, Int, ObjectType } from "type-graphql";
import { ApplicationUser } from "../entities/ApplicationUser";
import { FieldError } from "./FieldError";

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => ApplicationUser, { nullable: true })
  user?: ApplicationUser;
}

@InputType()
class CreateGroupInputType {
  @Field(() => String, {
    nullable: false,
  })
  groupName: string;

  @Field(() => [Int!])
  membersIdList: number[];
}

@InputType()
class CreateTransactionInputType {
  @Field(() => String, {
    nullable: false,
  })
  message: string;

  @Field(() => Int, {
    nullable: false,
  })
  amount: number;

  @Field(() => Int, {
    nullable: false,
  })
  groupId: number;
}

export { CreateGroupInputType, CreateTransactionInputType };
