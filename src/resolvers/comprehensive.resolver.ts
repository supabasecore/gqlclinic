import {
  Arg,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { Comprehensive } from "../schemas/comprehensive";
import { ComprehensiveInput } from "../res/comprehensive";
import { validateComprehensive } from "../validator/comprehensive";

@ObjectType()
class ComprehensiveFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class ComprehensiveResponse {
  @Field(() => [ComprehensiveFieldError], { nullable: true })
  errors?: ComprehensiveFieldError[];

  @Field(() => Comprehensive, { nullable: true })
  comprehensive?: Comprehensive;
}

@Resolver(Comprehensive)
export class ComprehensiveResolver {
  @Query(() => [Comprehensive], { nullable: true })
  @UseMiddleware(isAuth)
  async comprehensives(): Promise<Comprehensive[] | null> {
    // @Arg("isSurgery", () => Boolean, { nullable: true })
    // isSurgery: boolean | null
    try {
      const comprehensive = await Comprehensive.createQueryBuilder("c")
        .select([
          `"c"."id" as id`,
          `"c"."name" as name`,
          `"c"."isSurgery" as "isSurgery"`,
          `(SELECT COUNT(*) FROM service s WHERE s."comprehensiveId" = c.id) AS "serviceCount"`,
          //     `(SELECT COALESCE(
          //   JSON_AGG(
          //     JSON_BUILD_OBJECT(
          //       'id', "s"."id",
          //       'title', "s"."title",
          //       'description', "s"."description"
          //     )
          //   ), '[]'
          // ) FROM "service" "s" WHERE "s"."comprehensiveId" = "c"."id") AS "service"`,
        ])
        // .where(
        //   isSurgery === null
        //     ? "c.isSurgery IS NULL"
        //     : "c.isSurgery = :isSurgery",
        //   { isSurgery }
        // )
        .groupBy("c.id")
        .orderBy("c.id", "DESC")
        .getRawMany();

      return comprehensive || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Mutation(() => ComprehensiveResponse)
  async createComprehensive(
    @Arg("input") input: ComprehensiveInput
  ): Promise<ComprehensiveResponse> {
    const errors = validateComprehensive(input);
    if (errors) return { errors };

    try {
      const query = await Comprehensive.createQueryBuilder("c")
        .createQueryBuilder()
        .select([
          `"c"."id" as id`,
          `"c"."name" as name`,
          `"c"."isSurgery" as "isSurgery"`,
          `(SELECT COALESCE(COUNT(*), 0) FROM service s WHERE s."comprehensiveId" = c.id) AS "serviceCount"`,
        ])
        .from(Comprehensive, "c")
        .where(`"c"."isSurgery" = :isSurgery AND "c"."name" ILIKE :name`, {
          isSurgery: input.isSurgery,
          name: `%${input.name}%`,
        })
        .orderBy("(SELECT NULL)")
        .offset(0)
        .limit(1)
        .getRawOne();

      if (query) {
        return {
          errors: [
            {
              field: "name",
              message: "El nombre a sido registrado anteriormente",
            },
          ],
        };
      }

      const comprehensive = Comprehensive.create({
        name: input.name,
        isSurgery: input.isSurgery,
      });

      await comprehensive.save();

      return { comprehensive };
    } catch (e) {
      console.log(e);

      return {
        errors: [
          {
            field: "name",
            message: e as string,
          },
        ],
      };
    }
  }

  @Mutation(() => Boolean)
  async deleteComprehensive(
    @Arg("id", () => Int) id: number
  ): Promise<boolean> {
    try {
      const comprehensive = await Comprehensive.findOne({ where: { id } });

      if (!comprehensive) {
        return false;
      }

      await comprehensive.remove();
      return true;
    } catch (e) {
      console.log("...", e);
      return false;
    }
  }
}
