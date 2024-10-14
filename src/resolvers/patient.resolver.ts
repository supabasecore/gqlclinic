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
import { Patient } from "../schemas/patient";
import axios, { AxiosError } from "axios";

@ObjectType()
class PatientFieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class PatientResponse {
  @Field(() => [PatientFieldError], { nullable: true })
  errors?: PatientFieldError[];

  @Field(() => Patient, { nullable: true })
  patient?: Patient;
}

@Resolver(Patient)
export class PatientResolver {
  @Query(() => [Patient], { nullable: true })
  @UseMiddleware(isAuth)
  async patients(): Promise<Patient[] | null> {
    try {
      const patient = await Patient.createQueryBuilder("p")
        .select([
          `"p"."id" as id`,
          `"p"."name" as name`,
          `"p"."lastname" as lastname`,
          `"p"."dni" as dni`,
          `"p"."email" as email`,
          `"p"."phone" as phone`,
          `"p"."createdAt" as "createdAt"`,
          `"p"."updatedAt" as "updatedAt"`,
          `(SELECT COUNT(*) FROM diary d WHERE d."patientId" = p.id) AS "diaryCount"`,
        ])
        .orderBy("p.createdAt", "DESC")
        .getRawMany();

      return patient || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Mutation(() => PatientResponse)
  async createPatient(@Arg("dni") dni: string): Promise<PatientResponse> {
    if (!/^\d{8}$/.test(dni)) {
      return {
        errors: [
          {
            field: "dni",
            message: "DNI inválido, debe tener 8 caracteres numéricos",
          },
        ],
      };
    }

    const apiUrl = `http://localhost:8080/dni/${dni}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        const reniec = response.data;

        if (reniec.data) {
          const query = await Patient.findOne({ where: { dni } });
          if (query) {
            if (query.dni === dni) {
              return {
                errors: [
                  {
                    field: "duplicate",
                    message: `${query.id}`,
                  },
                ],
              };
            }
          }

          const patient = Patient.create({
            dni: reniec.data["dni"],
            name: reniec.data["name"],
            lastname: reniec.data["lastname"],
          });

          await patient.save();

          return { patient };
        } else {
          return {
            errors: [
              {
                field: "dni",
                message: "Número de DNI no encontrado.",
              },
            ],
          };
        }
      } else if (response.status === 422 || response.status === 404) {
        return {
          errors: [
            {
              field: "dni",
              message: "DNI inválido, intenta nuevamente.",
            },
          ],
        };
      } else {
        return {
          errors: [
            {
              field: "dni",
              message: `Error en la solicitud. Código de estado: ${response.status}`,
            },
          ],
        };
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422 || error.response?.status === 404) {
          return {
            errors: [
              {
                field: "dni",
                message: "DNI inválido, intenta nuevamente.",
              },
            ],
          };
        }
      }
      return {
        errors: [
          {
            field: "dni",
            message: `Error en la solicitud: ${error.message}`,
          },
        ],
      };
    }
  }

  @Mutation(() => Boolean)
  async deletePatient(@Arg("id", () => Int) id: number): Promise<boolean> {
    try {
      const patient = await Patient.findOne({ where: { id } });

      if (!patient) {
        return false;
      }

      await patient.remove();
      return true;
    } catch (e) {
      console.log("...", e);
      return false;
    }
  }
}
