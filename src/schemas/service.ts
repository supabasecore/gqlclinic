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

import { Field, Int, ObjectType } from "type-graphql";
import { Comprehensive } from "./comprehensive";
import { Auxiliary } from "./auxiliary";
import { Diary } from "./diary";
// import { Diary } from "./diary";

/**
 * Cirugía dental
    - Implantes dentales
    - Cirugía de tejidos blandos
    - Cirugía maxilofacial

 * Odontología general
    - Endodoncia
    - Periodoncia
    - Ortodoncia
    - Rehabilitación oral
    - Estética dental
    - Pediatría
 */

@ObjectType()
@Entity()
export class Service extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Auxiliary, (s) => s.serviceAuxiliary)
  auxiliarySchema: Auxiliary[];

  @OneToMany(() => Diary, (s) => s.serviceDiary)
  serviceSchema: Diary[];

  @Field(() => Int)
  @Column({ type: "int", nullable: false })
  comprehensiveId: number;

  @ManyToOne(() => Comprehensive, (c) => c.services)
  @JoinColumn({ name: "comprehensiveId", referencedColumnName: "id" })
  comprehensiveSchema: Comprehensive;

  @Field(() => String)
  @Column({ type: "varchar", length: 150, nullable: false })
  title: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 250, nullable: false })
  description: string;

  @Field(() => Comprehensive)
  comprehensive: Comprehensive;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
