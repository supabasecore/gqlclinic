import { Arg, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import { Auxiliary } from "../schemas/auxiliary";
import { AuxiliaryInput } from "../res/auxiliary";

@ObjectType()
class AuxiliaryFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class AuxiliaryResponse {
  @Field(() => [AuxiliaryFieldError], { nullable: true })
  errors?: AuxiliaryFieldError[];

  @Field(() => Auxiliary, { nullable: true })
  auxiliary?: Auxiliary;
}

@Resolver(Auxiliary)
export class AuxiliaryResolver {
  @Mutation(() => AuxiliaryResponse)
  async createAuxiliary(
    @Arg("input") input: AuxiliaryInput
  ): Promise<AuxiliaryResponse> {
    try {
      const auxiliary = Auxiliary.create({
        diaryId: input.diaryId,
        serviceId: input.serviceId,
        comment: input.comment,
      });

      await auxiliary.save();

      return { auxiliary };
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
