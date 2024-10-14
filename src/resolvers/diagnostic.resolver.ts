import { DiagnosticInput } from "../res/diagnostic";
import { Diagnostic } from "../schemas/diagnostic";
import { Arg, Field, Mutation, ObjectType, Resolver } from "type-graphql";

@ObjectType()
class DiagnosticFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class DiagnosticResponse {
  @Field(() => [DiagnosticFieldError], { nullable: true })
  errors?: DiagnosticFieldError[];

  @Field(() => Diagnostic, { nullable: true })
  diagnostic?: Diagnostic;
}

@Resolver(Diagnostic)
export class DiagnosticResolver {
  @Mutation(() => DiagnosticResponse)
  async createDiagnostic(
    @Arg("input") input: DiagnosticInput
  ): Promise<DiagnosticResponse> {
    try {
      const diagnostic = Diagnostic.create({
        diaryId: input.diaryId,
        cie: input.cie,
        description: input.description,
        presumptive: input.presumptive,
        definitive: input.definitive,
        repetitive: input.repetitive,
      });

      await diagnostic.save();

      return { diagnostic };
    } catch (e) {
      console.log(e);

      return {
        errors: [
          {
            field: "cie",
            message: e as string,
          },
        ],
      };
    }
  }
}
