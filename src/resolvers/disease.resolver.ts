import { DiseaseInput } from "../res/disease";
import { Disease } from "../schemas/disease";
import { Arg, Field, Mutation, ObjectType, Resolver } from "type-graphql";

@ObjectType()
class DiseaseFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class DiseaseResponse {
  @Field(() => [DiseaseFieldError], { nullable: true })
  errors?: DiseaseFieldError[];

  @Field(() => Disease, { nullable: true })
  disease?: Disease;
}

@Resolver(Disease)
export class DiseaseResolver {
  @Mutation(() => DiseaseResponse)
  async createDisease(
    @Arg("input") input: DiseaseInput
  ): Promise<DiseaseResponse> {
    try {
      const disease = Disease.create({
        diaryId: input.diaryId,
        isStart: input.isStart,
        isCourse: input.isCourse,
        sickTime: input.sickTime,
        comment: input.comment,
      });

      await disease.save();

      return { disease };
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
