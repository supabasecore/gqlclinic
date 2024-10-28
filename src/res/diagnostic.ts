import { TrimmedStringField } from "../utils/decorators/string";
import { InputType, Field, Int } from "type-graphql";

@InputType()
export class DiagnosticInput {
  @Field(() => Int, { nullable: false })
  diaryId: number;

  @Field(() => String, { nullable: false })
  @TrimmedStringField()
  cie: string;

  @Field(() => String, { nullable: false })
  @TrimmedStringField()
  description: string;

  @Field(() => String, { nullable: true })
  @TrimmedStringField()
  presumptive: string | null;

  @Field(() => String, { nullable: true })
  @TrimmedStringField()
  definitive: string | null;

  @Field(() => String, { nullable: true })
  @TrimmedStringField()
  repetitive: string | null;
}
