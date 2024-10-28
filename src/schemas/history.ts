import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { Diary } from "./diary";

@ObjectType()
@Entity()
export class History extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, { nullable: false })
  @Column({ type: "int", nullable: false })
  diaryId: number;

  @ManyToOne(() => Diary, (c) => c.historySchema)
  @JoinColumn({ name: "diaryId", referencedColumnName: "id" })
  historyDiary: Diary;

  @Field(() => String)
  @Column({ type: "varchar", length: 250, nullable: false })
  person: string;

  @Field(() => String)
  @Column({ type: "varchar", nullable: false })
  disease: string;
}
