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

  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  diaryId: number | null;

  @ManyToOne(() => Diary, (c) => c.vitalSchema)
  @JoinColumn({ name: "diaryId", referencedColumnName: "id" })
  diarySchema: Diary;

  @Field(() => Float)
  @Column({ type: "decimal", default: 0 })
  weight: number;

  @Field(() => Float)
  @Column({ type: "decimal", default: 0 })
  height: number;

  @Field(() => Float)
  @Column({ type: "decimal", default: 0 })
  temp: number;

  @Field(() => Float)
  @Column({ type: "decimal", default: 0 })
  arterial: number;

  @Field(() => Float)
  @Column({ type: "decimal", default: 0 })
  cardiac: number;

  @Field(() => Float)
  @Column({ type: "decimal", default: 0 })
  respiratory: number;

  @Field(() => Float)
  @Column({ type: "decimal", default: 0 })
  oxygen: number;

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
