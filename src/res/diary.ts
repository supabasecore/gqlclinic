import { TrimmedStringField } from "../utils/decorators/string";
import { InputType, Field, Int, Float } from "type-graphql";

@InputType()
export class DiaryInput {
  @Field(() => Int, { nullable: false })
  serviceId: number;

  @Field(() => String, { nullable: false })
  patientId: string;

  @Field(() => Float, { nullable: true })
  price: number;

  @Field(() => String, { defaultValue: "PENDING" })
  @TrimmedStringField()
  status: string;

  @Field(() => String, { nullable: true })
  @TrimmedStringField()
  intervention: string | null;

  @Field(() => String, { nullable: true })
  @TrimmedStringField()
  interconsultation: string | null;

  @Field(() => Float, { nullable: true })
  weight: number;

  @Field(() => Date, { nullable: true })
  nextTime: Date | null;

  @Field(() => Date, { nullable: false })
  startTime: Date;

  @Field(() => Date, { nullable: true })
  endTime: Date | null;
}

@InputType()
export class DiaryStateInput {
  @Field(() => Float, { nullable: true })
  price: number;

  @Field(() => String, { defaultValue: "PENDING" })
  @TrimmedStringField()
  status: string;

  @Field(() => String, { nullable: true })
  @TrimmedStringField()
  intervention: string | null;

  @Field(() => String, { nullable: true })
  @TrimmedStringField()
  interconsultation: string | null;

  @Field(() => Float, { nullable: true })
  weight: number;

  @Field(() => Date, { nullable: true })
  nextTime: Date | null;

  @Field(() => Date, { nullable: false })
  startTime: Date;
}
