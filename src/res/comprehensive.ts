import { TrimmedStringField } from "../utils/decorators/string";
import { InputType, Field } from "type-graphql";

@InputType()
export class ComprehensiveInput {
  @Field(() => String, { nullable: false })
  @TrimmedStringField()
  name: string;

  @Field(() => Boolean, { nullable: true })
  isSurgery: boolean | null;
}
