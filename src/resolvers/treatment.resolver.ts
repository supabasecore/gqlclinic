import { TreatmentInput } from "../res/treatment";
import { Treatment } from "../schemas/treatment";
import { Arg, Field, Mutation, ObjectType, Resolver } from "type-graphql";

@ObjectType()
class TreatmentFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class TreatmentResponse {
  @Field(() => [TreatmentFieldError], { nullable: true })
  errors?: TreatmentFieldError[];

  @Field(() => Treatment, { nullable: true })
  treatment?: Treatment;
}

@Resolver(Treatment)
export class TreatmentResolver {
  @Mutation(() => TreatmentResponse)
  async createTreatment(
    @Arg("input") input: TreatmentInput
  ): Promise<TreatmentResponse> {
    try {
      const treatment = Treatment.create({
        diaryId: input.diaryId,
        medicine: input.medicine,
        presentation: input.presentation,
        quantity: input.quantity,
        dose: input.dose,
        days: input.days,
      });

      await treatment.save();

      return { treatment };
    } catch (e) {
      console.log(e);

      return {
        errors: [
          {
            field: "medicine",
            message: e as string,
          },
        ],
      };
    }
  }
}
