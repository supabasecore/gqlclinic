import { TrimmedStringField } from "../utils/decorators/string";
import { InputType, Field } from "type-graphql";

@InputType()
export class PatientInput {
  @Field(() => String, { nullable: false })
  @TrimmedStringField()
  name: string;

  @Field(() => String, { nullable: false })
  @TrimmedStringField()
  dni: string;

  @Field(() => String, { nullable: false })
  @TrimmedStringField()
  email: string;

  @Field(() => String, { nullable: false })
  @TrimmedStringField()
  phone: string;
}
