import { HistoryInput } from "../res/history";
import { History } from "../schemas/history";
import { Arg, Field, Mutation, ObjectType, Resolver } from "type-graphql";

@ObjectType()
class HistoryFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class HistoryResponse {
  @Field(() => [HistoryFieldError], { nullable: true })
  errors?: HistoryFieldError[];

  @Field(() => History, { nullable: true })
  history?: History;
}

@Resolver(History)
export class HistoryResolver {
  @Mutation(() => HistoryResponse)
  async createHistory(
    @Arg("input") input: HistoryInput
  ): Promise<HistoryResponse> {
    try {
      const history = History.create({
        diaryId: input.diaryId,
        person: input.person,
        disease: input.disease,
      });

      await history.save();

      return { history };
    } catch (e) {
      console.log(e);

      return {
        errors: [
          {
            field: "person",
            message: e as string,
          },
        ],
      };
    }
  }
}
