import { TrimmedStringField } from "../utils/decorators/string";
import { InputType, Field, Int } from "type-graphql";

@InputType()
export class DiseaseInput {
  @Field(() => Int, { nullable: false })
  diaryId: number;

  @Field(() => Boolean, { nullable: false })
  isStart: boolean;

  @Field(() => Boolean, { nullable: false })
  isCourse: boolean;

  @Field(() => Int, { nullable: true })
  sickTime: number;

  @Field(() => String, { nullable: true })
  @TrimmedStringField()
  comment: string | null;
}
