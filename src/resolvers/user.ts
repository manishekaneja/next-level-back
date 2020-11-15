import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { __cookie_name__ } from '../constants';
import { User } from '../entities/User';
import { MyContext } from '../types';

@InputType()
class UsernamePasswordInput {
  @Field()
  username!: string;

  @Field()
  password!: string;

  @Field({
    nullable: true,
  })
  first_name: string;

  @Field({
    nullable: true,
  })
  last_name: string;
}

@ObjectType()
class FieldError {
  @Field(() => String)
  field: String;

  @Field(() => String)
  message: String;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  register(
    @Ctx() { em, request }: MyContext,
    @Arg('options')
    { username, password, first_name, last_name }: UsernamePasswordInput
  ): UserResponse {
    const user = em.create(User, {
      username,
      password,
      first_name,
      last_name,
    });
    em.persistAndFlush(user);
    request.session.userId = user.id;
    return {
      user,
    };
  }

  @Mutation(() => UserResponse, {
    nullable: true,
  })
  async login(
    @Ctx() { em, request }: MyContext,
    @Arg('options') { username, password }: UsernamePasswordInput
  ): Promise<UserResponse> {
    try {
      const user: User = await em.findOneOrFail(User, {
        username,
      });
      if (user.password === password) {
        request.session.userId = user.id;
        return { user };
      } else {
        return {
          errors: [
            {
              field: 'Incorrect',
              message: 'Wrong username/password',
            },
          ],
        };
      }
    } catch (error) {
      return {
        errors: [
          {
            field: 'Internal Error',
            message: error.message,
          },
        ],
      };
    }
  }

  @Query(() => UserResponse, {
    nullable: true,
  })
  async me(@Ctx() { em, request }: MyContext): Promise<UserResponse> {
    try {
      if (!request.session.userId) {
        return {
          errors: [
            {
              field: 'Not Identified',
              message: 'Perform to Login Operation',
            },
          ],
        };
      }
      const id = request.session.userId;

      const user = await em.findOneOrFail(User, {
        id,
      });
      return {
        user,
      };
    } catch (error) {
      return {
        errors: [
          {
            field: 'Internal Error',
            message: error.message,
          },
        ],
      };
    }
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() { request, response }: MyContext,
    @Arg('removeAll') removeAll: boolean
  ) {
    try {
      console.log({ removeAll });
      return new Promise(function (resolve) {
        request.session.destroy(function (error) {
          if (error) {
            resolve(false);
          }
          response.clearCookie(__cookie_name__);
          resolve(true);
          return;
        });
      });
    } catch (error) {
      return {
        errors: [
          {
            field: 'Internal Error',
            message: error.message,
          },
        ],
      };
    }
  }
}
