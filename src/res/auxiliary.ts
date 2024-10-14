import { TrimmedStringField } from "../utils/decorators/string";
import { InputType, Field, Int } from "type-graphql";

@InputType()
export class AuxiliaryInput {
  @Field(() => Int, { nullable: false })
  diaryId: number;

  @Field(() => Int, { nullable: false })
  serviceId: number;

  @Field(() => String, { nullable: true })
  @TrimmedStringField()
  comment: string | null;
}
