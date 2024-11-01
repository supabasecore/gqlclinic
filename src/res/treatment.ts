import { InputType, Field, Int } from "type-graphql";

@InputType()
export class TreatmentInput {
  @Field(() => Int, { nullable: false })
  diaryId: number;

  @Field(() => String, { nullable: true })
  medicine: string | null;

  @Field(() => String, { nullable: true })
  presentation: string | null;

  @Field(() => Int, { nullable: true })
  quantity: number | null;

  @Field(() => Int, { nullable: true })
  dose: number | null;

  @Field(() => Int, { nullable: true })
  days: number | null;
}
