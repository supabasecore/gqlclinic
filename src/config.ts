import { DataSource } from "typeorm";
import { User } from "./schemas/user";
import { Comprehensive } from "./schemas/comprehensive";
import { Service } from "./schemas/service";
import { Auxiliary } from "./schemas/auxiliary";
import { Diagnostic } from "./schemas/diagnostic";
import { Diary } from "./schemas/diary";
import { Disease } from "./schemas/disease";
import { Treatment } from "./schemas/treatment";
import { Vital } from "./schemas/vital";
import { History } from "./schemas/history";
import { Patient } from "./schemas/patient";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: "postgresql://postgres.rtpmvliudhfwqjvciizz:supabase.com@aws-0-us-west-1.pooler.supabase.com:6543/postgres",
  logging: true,
  synchronize: true,
  entities: [
    User,
    Comprehensive,
    Service,
    Auxiliary,
    Diagnostic,
    Diary,
    Disease,
    Treatment,
    Vital,
    History,
    Patient,
  ],
});
