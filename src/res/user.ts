import { TrimmedStringField } from "../utils/decorators/string";
import { InputType, Field } from "type-graphql";

@InputType()
export class UsernamePasswordInput {
  @Field()
  @TrimmedStringField()
  email: string;

  @Field()
  @TrimmedStringField()
  username: string;

  @Field()
  password: string;
}
