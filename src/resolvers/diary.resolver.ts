import { isAuth } from "../middleware/isAuth";
import { DiaryInput, DiaryStateInput } from "../res/diary";
import { Diary } from "../schemas/diary";
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
import { Patient } from "../schemas/patient";
import { Service } from "../schemas/service";

@ObjectType()
class DiaryFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class DiaryResponse {
  @Field(() => [DiaryFieldError], { nullable: true })
  errors?: DiaryFieldError[];

  @Field(() => Diary, { nullable: true })
  diary?: Diary;
}

@Resolver(Diary)
export class DiaryResolver {
  @Mutation(() => DiaryResponse)
  async createDiary(@Arg("input") input: DiaryInput): Promise<DiaryResponse> {
    const startDate = new Date(input.startTime);

    const startHour = startDate.getHours();
    const startDay = startDate.getDate();

    const nextDate = new Date(input.nextTime!);

    const nextHour = nextDate.getHours();
    const nextDay = nextDate.getDate();

    try {
      if (input.status !== "ATTENDED" && input.status !== "CANCEL") {
        const startTime = await Diary.createQueryBuilder("d")
          .select([
            `JSON_BUILD_OBJECT(
          'id', "p"."id",
          'dni', "p"."dni",
          'name', "p"."name",
          'lastname', "p"."lastname",
          'phone', "p"."phone"
        ) as "patient"`,
          ])
          .where(
            "EXTRACT(HOUR FROM d.startTime) = :startHour AND EXTRACT(DAY FROM d.startTime) = :startDay",
            {
              startHour,
              startDay,
            }
          )
          .leftJoin(Patient, "p", `p.id = d."patientId"`)
          .orderBy("(SELECT NULL)")
          .offset(0)
          .limit(1)
          .getRawOne();

        if (startTime) {
          return {
            errors: [
              {
                field: "startTime",
                message: `Recuerda que el día y la hora ya han sido separados.<div class="ml8">- ${startTime.patient.name} ${startTime.patient.lastname}</div>`,
              },
            ],
          };
        }

        if (input.status !== "PENDING") {
          const nextTime = await Diary.createQueryBuilder("d")
            .where(
              "EXTRACT(HOUR FROM d.nextTime) = :nextHour AND EXTRACT(DAY FROM d.nextTime) = :nextDay",
              {
                nextHour,
                nextDay,
              }
            )
            .orderBy("(SELECT NULL)")
            .offset(0)
            .limit(1)
            .getRawOne();

          if (nextTime) {
            return {
              errors: [
                {
                  field: "nextTime",
                  message:
                    "Recuerda que el día y la hora ya han sido reprogramados",
                },
              ],
            };
          }
        }
      }

      const patient = await Patient.findOne({
        where: { dni: input.patientId },
      });

      if (!patient) {
        return {
          errors: [
            {
              field: "patientId",
              message: "El paciente no ha sido registrado por la clínica.",
            },
          ],
        };
      }

      const create = Diary.create({
        serviceId: input.serviceId,
        patientId: patient.id,
        price: input.price,
        status: input.status,
        intervention: input.intervention,
        interconsultation: input.interconsultation,
        weight: input.weight,
        nextTime: input.nextTime,
        startTime: input.startTime,
        endTime: input.endTime,
      });

      await create.save();

      const diary = await Diary.createQueryBuilder("d")
        .select([
          `"d"."id" as id`,
          `"d"."price" as price`,
          `"d"."status" as status`,
          `"d"."intervention" as intervention`,
          `"d"."interconsultation" as interconsultation`,
          `"d"."weight" as weight`,
          `"d"."nextTime" as "nextTime"`,
          `"d"."startTime" as "startTime"`,
          `COALESCE("d"."endTime", NULL) as "endTime"`,
          `"d"."createdAt" as "createdAt"`,
          `"d"."updatedAt" as "updatedAt"`,
          `JSON_BUILD_OBJECT(
          'id', "s"."id",
          'title', "s"."title",
          'description', "s"."description"
        ) as "service"`,
          `JSON_BUILD_OBJECT(
          'id', "p"."id",
          'dni', "p"."dni",
          'name', "p"."name",
          'lastname', "p"."lastname",
          'phone', "p"."phone"
        ) as "patient"`,
        ])
        .leftJoin(Patient, "p", `p.id = d."patientId"`)
        .leftJoin(Service, "s", `s.id = d."serviceId"`)
        .where("d.id = :id", { id: create.id })
        .orderBy("p.createdAt", "DESC")
        .getRawOne();

      return { diary };
    } catch (e) {
      console.log(e);

      return {
        errors: [
          {
            field: "weight",
            message: e as string,
          },
        ],
      };
    }
  }

  @Mutation(() => DiaryResponse)
  @UseMiddleware(isAuth)
  async updateDiaryStatus(
    @Arg("id", () => Int) id: number,
    @Arg("input") input: DiaryStateInput
  ): Promise<DiaryResponse> {
    const startDate = new Date(input.startTime);

    const startHour = startDate.getHours();
    const startDay = startDate.getDate();

    const nextDate = new Date(input.nextTime!);

    const nextHour = nextDate.getHours();
    const nextDay = nextDate.getDate();

    try {
      if (input.status !== "ATTENDED" && input.status !== "CANCEL") {
        const startTime = await Diary.createQueryBuilder("d")
          .select([
            `JSON_BUILD_OBJECT(
          'id', "p"."id",
          'dni', "p"."dni",
          'name', "p"."name",
          'lastname', "p"."lastname",
          'phone', "p"."phone"
        ) as "patient"`,
          ])
          .where(
            "EXTRACT(HOUR FROM d.startTime) = :startHour AND EXTRACT(DAY FROM d.startTime) = :startDay",
            {
              startHour,
              startDay,
            }
          )
          .leftJoin(Patient, "p", `p.id = d."patientId"`)
          .orderBy("(SELECT NULL)")
          .offset(0)
          .limit(1)
          .getRawOne();

        if (startTime) {
          return {
            errors: [
              {
                field: "startTime",
                message: `Recuerda que el día y la hora ya han sido separados.<div class="ml8">- ${startTime.patient.name} ${startTime.patient.lastname}</div>`,
              },
            ],
          };
        }

        const nextTime = await Diary.createQueryBuilder("d")
          .where(
            "EXTRACT(HOUR FROM d.nextTime) = :nextHour AND EXTRACT(DAY FROM d.nextTime) = :nextDay",
            {
              nextHour,
              nextDay,
            }
          )
          .orderBy("(SELECT NULL)")
          .offset(0)
          .limit(1)
          .getRawOne();

        if (nextTime) {
          return {
            errors: [
              {
                field: "nextTime",
                message:
                  "Recuerda que el día y la hora ya han sido reprogramados",
              },
            ],
          };
        }
      }

      const diary = await Diary.createQueryBuilder("d")
        .select([
          `"d"."id" as id`,
          `"d"."price" as price`,
          `"d"."status" as status`,
          `"d"."intervention" as intervention`,
          `"d"."interconsultation" as interconsultation`,
          `"d"."weight" as weight`,
          `"d"."nextTime" as "nextTime"`,
          `"d"."startTime" as "startTime"`,
          `COALESCE("d"."endTime", NULL) as "endTime"`,
          `"d"."createdAt" as "createdAt"`,
          `"d"."updatedAt" as "updatedAt"`,
          `JSON_BUILD_OBJECT(
          'id', "s"."id",
          'title', "s"."title",
          'description', "s"."description"
        ) as "service"`,
          `JSON_BUILD_OBJECT(
          'id', "p"."id",
          'dni', "p"."dni",
          'name', "p"."name",
          'lastname', "p"."lastname",
          'phone', "p"."phone"
        ) as "patient"`,
        ])
        .leftJoin(Patient, "p", `p.id = d."patientId"`)
        .leftJoin(Service, "s", `s.id = d."serviceId"`)
        .where("d.id = :id", { id })
        .orderBy("p.createdAt", "DESC")
        .getRawOne();

      if (!diary) {
        return {
          errors: [
            {
              field: "id",
              message: "Diary entry not found",
            },
          ],
        };
      }

      await Diary.update(id, {
        price: input.price,
        status: input.status,
        intervention: input.intervention,
        interconsultation: input.interconsultation,
        weight: input.weight,
        nextTime: input.nextTime,
        startTime: input.startTime,
      });

      return { diary };
    } catch (error) {
      console.error(error);
      return {
        errors: [
          {
            field: "price",
            message: error as string,
          },
        ],
      };
    }
  }

  @Query(() => [Diary], { nullable: true })
  @UseMiddleware(isAuth)
  async diary(): Promise<Diary[] | null> {
    try {
      const diary = await Diary.createQueryBuilder("d")
        .select([
          `"d"."id" as id`,
          `"d"."price" as price`,
          `"d"."status" as status`,
          `"d"."intervention" as intervention`,
          `"d"."interconsultation" as interconsultation`,
          `"d"."weight" as weight`,
          `"d"."nextTime" as "nextTime"`,
          `"d"."startTime" as "startTime"`,
          `COALESCE("d"."endTime", NULL) as "endTime"`,
          `"d"."createdAt" as "createdAt"`,
          `"d"."updatedAt" as "updatedAt"`,
          `JSON_BUILD_OBJECT(
          'id', "s"."id",
          'title', "s"."title",
          'description', "s"."description"
        ) as "service"`,
          `JSON_BUILD_OBJECT(
          'id', "p"."id",
          'dni', "p"."dni",
          'name', "p"."name",
          'lastname', "p"."lastname",
          'phone', "p"."phone"
        ) as "patient"`,
        ])
        .leftJoin(Patient, "p", `p.id = d."patientId"`)
        .leftJoin(Service, "s", `s.id = d."serviceId"`)
        .orderBy("p.createdAt", "DESC")
        .getRawMany();

      return diary || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Mutation(() => Boolean)
  async deleteDiary(@Arg("id", () => Int) id: number): Promise<boolean> {
    try {
      const diary = await Diary.findOne({ where: { id } });

      if (!diary) {
        return false;
      }

      await diary.remove();
      return true;
    } catch (e) {
      console.log("...", e);
      return false;
    }
  }
}
