import { VitalInput } from "../res/vital";
import { Vital } from "../schemas/vital";
import { Arg, Field, Mutation, ObjectType, Resolver } from "type-graphql";

@ObjectType()
class VitalFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class VitalResponse {
  @Field(() => [VitalFieldError], { nullable: true })
  errors?: VitalFieldError[];

  @Field(() => Vital, { nullable: true })
  vital?: Vital;
}

@Resolver(Vital)
export class VitalResolver {
  @Mutation(() => VitalResponse)
  async createVital(@Arg("input") input: VitalInput): Promise<VitalResponse> {
    try {
      const vital = Vital.create({
        diaryId: input.diaryId,
        height: input.height,
        weight: input.weight,
        temp: input.temp,
        arterial: input.arterial,
        cardiac: input.cardiac,
        respiratory: input.respiratory,
        oxygen: input.oxygen,
        comment: input.comment,
      });

      await vital.save();

      return { vital };
    } catch (e) {
      console.log(e);

      return {
        errors: [
          {
            field: "comment",
            message: e as string,
          },
        ],
      };
    }
  }
}
