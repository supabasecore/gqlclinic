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
import { Service } from "./service";

@ObjectType()
@Entity()
export class Comprehensive extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Service, (s) => s.comprehensiveSchema)
  services: Service[];

  @Field(() => String)
  @Column({ type: "varchar", length: 250, nullable: false })
  name: string;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: "boolean", nullable: true })
  isSurgery: boolean | null;

  @Field(() => [Service])
  service: Service[];

  @Field(() => Int, { nullable: true })
  serviceCount: number | null;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
