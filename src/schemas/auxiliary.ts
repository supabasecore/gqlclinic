import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { Diary } from "./diary";
import { Service } from "./service";

@ObjectType()
@Entity()
export class Auxiliary extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, { nullable: false })
  @Column({ type: "int", nullable: false })
  diaryId: number;

  @ManyToOne(() => Diary, (c) => c.auxiliarySchema)
  @JoinColumn({ name: "diaryId", referencedColumnName: "id" })
  auxiliaryDiary: Diary;

  @Field(() => Int, { nullable: false })
  @Column({ type: "int", nullable: false })
  serviceId: number;

  @ManyToOne(() => Service, (c) => c.auxiliarySchema)
  @JoinColumn({ name: "serviceId", referencedColumnName: "id" })
  serviceAuxiliary: Service;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 250, nullable: true })
  comment: string | null;
}
