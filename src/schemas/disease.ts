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
export class Disease extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, { nullable: false })
  @Column({ type: "int", nullable: false })
  diaryId: number;

  @ManyToOne(() => Diary, (c) => c.diseaseSchema)
  @JoinColumn({ name: "diaryId", referencedColumnName: "id" })
  diseaseDiary: Diary;

  @Field(() => Boolean, { nullable: false })
  @Column({ type: "boolean", default: false })
  isStart: boolean;

  @Field(() => Boolean, { nullable: false })
  @Column({ type: "boolean", default: false })
  isCourse: boolean;

  @Field(() => Int)
  @Column({ type: "int", default: 0 })
  sickTime: number;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 250, nullable: true })
  comment: string | null;
}
