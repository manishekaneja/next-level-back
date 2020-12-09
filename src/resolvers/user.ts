import { getUserFroUserId } from "../utilies/getUserFroimUserId";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { __cookie_name__ } from "../constants";
import { User } from "../entities/User";
import { MyContext } from "../types";
import { UsernamePasswordInput } from "../types/UsernamePasswordInput";
import { UserResponse } from "../types/UserResponse";

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  register(
    @Ctx() { em, request }: MyContext,
    @Arg("options")
    { username, email, password, first_name, last_name }: UsernamePasswordInput
  ): UserResponse {
    const user = em.create(User, {
      username,
      password,
      email,
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
    @Arg("options") { username, password }: UsernamePasswordInput
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
              field: "Incorrect",
              message: "Wrong username/password",
            },
          ],
        };
      }
    } catch (error) {
      return {
        errors: [
          {
            field: "Internal Error",
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
              field: "Not Identified",
              message: "Perform to Login Operation",
            },
          ],
        };
      }
      const user = await getUserFroUserId(request.session.userId, em);
      return {
        user,
      };
    } catch (error) {
      return {
        errors: [
          {
            field: "Internal Error",
            message: error.message,
          },
        ],
      };
    }
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() { request, response }: MyContext,
    @Arg("removeAll") removeAll: boolean
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
            field: "Internal Error",
            message: error.message,
          },
        ],
      };
    }
  }
}
