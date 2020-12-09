import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FieldError {
  @Field(() => String)
  field: String;

  @Field(() => String)
  message: String;
}
