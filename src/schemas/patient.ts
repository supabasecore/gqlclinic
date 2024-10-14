import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { Diary } from "./diary";

@ObjectType()
@Entity()
export class Patient extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Diary, (diaries) => diaries.patientDiary)
  diaries: Diary[];

  @Field(() => String)
  @Column({ type: "varchar", length: 250, nullable: false })
  name: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 250, nullable: false })
  lastname: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 8, nullable: false })
  dni: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", unique: true, nullable: true })
  email: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 25, nullable: true })
  phone: string | null;

  @Field(() => Int, { nullable: true })
  diaryCount: number | null;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
