import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, Float, Int, ObjectType } from "type-graphql";
import { Diary } from "./diary";

@ObjectType()
@Entity()
export class Vital extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, { nullable: false })
  @Column({ type: "int", nullable: false })
  diaryId: number;

  @ManyToOne(() => Diary, (c) => c.vitalSchema)
  @JoinColumn({ name: "diaryId", referencedColumnName: "id" })
  diarySchema: Diary;

  @Field(() => Float, { nullable: true })
  @Column({ type: "decimal", default: 0 })
  weight: number | null;

  @Field(() => Float, { nullable: true })
  @Column({ type: "decimal", default: 0 })
  height: number | null;

  @Field(() => Float, { nullable: true })
  @Column({ type: "decimal", default: 0 })
  temp: number | null;

  @Field(() => Float, { nullable: true })
  @Column({ type: "decimal", default: 0 })
  arterial: number | null;

  @Field(() => Float, { nullable: true })
  @Column({ type: "decimal", default: 0 })
  cardiac: number | null;

  @Field(() => Float, { nullable: true })
  @Column({ type: "decimal", default: 0 })
  respiratory: number | null;

  @Field(() => Float, { nullable: true })
  @Column({ type: "decimal", default: 0 })
  oxygen: number | null;

  @Field(() => String)
  @Column({ type: "varchar" })
  comment: string;

  /**
    peso           weight
    talla          height
    temp           temp
    arteral        arterial
    cardiaca       cardiac
    respiratoria   respiratory
    oxigeno        oxygen
   */
}
