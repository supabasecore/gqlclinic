import { TrimmedStringField } from "../utils/decorators/string";
import { InputType, Field, Int, Float } from "type-graphql";

@InputType()
export class VitalInput {
  @Field(() => Int, { nullable: false })
  diaryId: number;

  @Field(() => Float, { nullable: false })
  height: number;

  @Field(() => Float, { nullable: false })
  weight: number;

  @Field(() => Float, { nullable: false })
  temp: number;

  @Field(() => Float, { nullable: false })
  arterial: number;

  @Field(() => Float, { nullable: false })
  cardiac: number;

  @Field(() => Float, { nullable: false })
  respiratory: number;

  @Field(() => Float, { nullable: false })
  oxygen: number;

  @Field(() => String, { nullable: false })
  @TrimmedStringField()
  comment: string;
}
