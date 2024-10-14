import { TrimmedStringField } from "../utils/decorators/string";
import { InputType, Field, Int } from "type-graphql";

@InputType()
export class HistoryInput {
  @Field(() => Int, { nullable: false })
  diaryId: number;

  @Field(() => String, { nullable: false })
  @TrimmedStringField()
  person: string;

  @Field(() => String, { nullable: false })
  @TrimmedStringField()
  disease: string;
}
