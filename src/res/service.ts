import { TrimmedStringField } from "../utils/decorators/string";
import { InputType, Field, Int } from "type-graphql";

@InputType()
export class ServiceInput {
  @Field(() => Int, { nullable: false })
  comprehensiveId: number;

  @Field(() => String, { nullable: false })
  @TrimmedStringField()
  title: string;

  @Field(() => String, { nullable: false })
  @TrimmedStringField()
  description: string;
}
