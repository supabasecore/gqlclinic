import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { Service } from "../schemas/service";
import { ServiceInput } from "../res/service";
import { validateService } from "../validator/service";
import { Comprehensive } from "../schemas/comprehensive";

@ObjectType()
class ServiceFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class ServiceResponse {
  @Field(() => [ServiceFieldError], { nullable: true })
  errors?: ServiceFieldError[];

  @Field(() => Service, { nullable: true })
  service?: Service;
}

@Resolver(Service)
export class ServiceResolver {
  @Query(() => [Service], { nullable: true })
  @UseMiddleware(isAuth)
  async services(
    @Arg("isSurgery", () => Boolean) isSurgery: boolean
  ): Promise<Service[] | null> {
    try {
      const services = await Service.createQueryBuilder("s")
        .select([
          `"s"."id" as id`,
          `"s"."title" as title`,
          `"s"."description" as description`,
          `JSON_BUILD_OBJECT(
          'id', c.id,
          'name', c.name
        ) as "comprehensive"`,
        ])
        .leftJoin(Comprehensive, "c", `c.id = s."comprehensiveId"`)
        .where(
          "c.isSurgery = :isSurgery",
          // isSurgery === null
          //   ? "c.isSurgery IS NULL"
          //   : "c.isSurgery = :isSurgery",
          { isSurgery }
        )
        .orderBy("s.createdAt", "DESC")
        .getRawMany();

      return services || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Mutation(() => ServiceResponse)
  async createService(
    @Arg("input") input: ServiceInput
  ): Promise<ServiceResponse> {
    const errors = validateService(input);
    if (errors) return { errors };

    try {
      const query = await Service.createQueryBuilder("s")
        .createQueryBuilder()
        .select("*")
        .from(Service, "s")
        .where(
          `"s"."comprehensiveId" = :comprehensiveId AND "s"."title" = :title AND "s"."title" ILIKE :title`,
          {
            comprehensiveId: input.comprehensiveId,
            title: `%${input.title}%`,
          }
        )
        .orderBy("(SELECT NULL)")
        .offset(0)
        .limit(1)
        .getRawOne();

      if (query) {
        return {
          errors: [
            {
              field: "title",
              message: "El servicio a sido registrado anteriormente",
            },
          ],
        };
      }

      const service = Service.create({
        comprehensiveId: input.comprehensiveId,
        title: input.title,
        description: input.description,
      });

      await service.save();

      return { service };
    } catch (e) {
      console.log(e);

      return {
        errors: [
          {
            field: "title",
            message: e as string,
          },
        ],
      };
    }
  }
}
