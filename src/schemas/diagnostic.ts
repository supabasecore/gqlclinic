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
export class Diagnostic extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, { nullable: false })
  @Column({ type: "int", nullable: false })
  diaryId: number;

  @ManyToOne(() => Diary, (c) => c.diagnosticSchema)
  @JoinColumn({ name: "diaryId", referencedColumnName: "id" })
  diagnosticDiary: Diary;

  @Field(() => String)
  @Column({ type: "varchar", length: 250, nullable: false })
  cie: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 250, nullable: false })
  description: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 250, nullable: true })
  presumptive: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 250, nullable: true })
  definitive: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 250, nullable: true })
  repetitive: string | null;
}
