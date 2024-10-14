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

@ObjectType()
@Entity()
export class Treatment extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  diaryId: number | null;

  @ManyToOne(() => Diary, (c) => c.treatmentSchema)
  @JoinColumn({ name: "diaryId", referencedColumnName: "id" })
  treatmentDiary: Diary;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 250, nullable: true })
  medicine: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 250, nullable: true })
  presentation: string | null;

  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  quantity: number | null;

  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  dose: number | null;

  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  days: number | null;
}
