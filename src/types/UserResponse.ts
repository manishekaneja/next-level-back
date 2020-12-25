import { Field, ObjectType,Int } from "type-graphql";
import { ApplicationUser } from "../entities/ApplicationUser";
import { FieldError } from "./FieldError";

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => ApplicationUser, { nullable: true })
  user?: ApplicationUser;
}



class UserIdList{
  @Field(() => [Int], { nullable: true })
  list?: number[];  
} 
export { UserIdList };
