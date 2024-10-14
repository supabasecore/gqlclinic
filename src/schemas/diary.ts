import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, Float, Int, ObjectType } from "type-graphql";
// import { Service } from "./service";
import { Patient } from "./patient";
import { Vital } from "./vital";
import { Auxiliary } from "./auxiliary";
import { Diagnostic } from "./diagnostic";
import { Treatment } from "./treatment";
import { History } from "./history";
import { Disease } from "./disease";
import { Service } from "./service";

@ObjectType()
@Entity()
export class Diary extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Vital, (s) => s.diarySchema)
  vitalSchema: Vital[];

  @OneToMany(() => Auxiliary, (s) => s.auxiliaryDiary)
  auxiliarySchema: Auxiliary[];

  @OneToMany(() => Diagnostic, (s) => s.diagnosticDiary)
  diagnosticSchema: Diagnostic[];

  @OneToMany(() => Treatment, (s) => s.treatmentDiary)
  treatmentSchema: Treatment[];

  @OneToMany(() => History, (s) => s.historyDiary)
  historySchema: History[];

  @OneToMany(() => Disease, (s) => s.diseaseDiary)
  diseaseSchema: Disease[];

  @Field(() => Int)
  @Column({ type: "int", nullable: false })
  serviceId: number;

  @ManyToOne(() => Service, (s) => s.serviceSchema, { onDelete: "CASCADE" })
  @JoinColumn({ name: "serviceId", referencedColumnName: "id" })
  serviceDiary: Service;

  @Field(() => Int)
  @Column({ type: "int", nullable: false })
  patientId: number;

  @ManyToOne(() => Patient, (s) => s.diaries, { onDelete: "CASCADE" })
  @JoinColumn({ name: "patientId", referencedColumnName: "id" })
  patientDiary: Patient;

  @Field(() => Float)
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  price: number | null;

  @Field(() => String)
  @Column({
    type: "varchar",
    default: "PENDING",
    enum: ["PENDING", "CANCEL", "PROCESSED", "ATTENDED"],
  })
  status: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", nullable: true })
  intervention: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", nullable: true })
  interconsultation: string | null;

  @Field(() => Float, { nullable: true })
  @Column({ type: "decimal", nullable: true })
  weight: number;

  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamp", nullable: true })
  nextTime: Date | null;

  @Field(() => Date)
  @Column({ type: "timestamp", nullable: false })
  startTime: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamp", nullable: true })
  endTime: Date | null;

  @Field(() => Service)
  service: Service;

  @Field(() => Patient)
  patient: Patient;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
