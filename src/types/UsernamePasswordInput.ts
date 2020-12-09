import { Field, InputType } from "type-graphql";

@InputType()
export class UsernamePasswordInput {
  @Field()
  username!: string;

  
  @Field()
  password!: string;

  @Field({
    nullable:true
  })
  email: string;
  
  @Field({
    nullable: true,
  })
  first_name: string;

  @Field({
    nullable: true,
  })
  last_name: string;
}
