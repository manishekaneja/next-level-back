import { Field, InputType } from "type-graphql";

@InputType()
export class UsernamePasswordInput {
  @Field()
  username!: string;

  @Field()
  password!: string;

  @Field({
    nullable: true,
  })
  email: string;

  @Field({
    nullable: true,
  })
  firstname: string;

  @Field({
    nullable: true,
  })
  lastname: string;
}
