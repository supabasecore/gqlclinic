import { TrimmedStringField } from "../utils/decorators/string";
import { InputType, Field, Int, Float } from "type-graphql";

@InputType()
export class VitalInput {
  @Field(() => Int, { nullable: false })
  diaryId: number;

  @Field(() => Float, { nullable: true })
  height: number | null;

  @Field(() => Float, { nullable: true })
  weight: number | null;

  @Field(() => Float, { nullable: true })
  temp: number | null;

  @Field(() => Float, { nullable: true })
  arterial: number | null;

  @Field(() => Float, { nullable: true })
  cardiac: number | null;

  @Field(() => Float, { nullable: true })
  respiratory: number | null;

  @Field(() => Float, { nullable: true })
  oxygen: number | null;

  @Field(() => String, { nullable: true })
  @TrimmedStringField()
  comment: string;
}
