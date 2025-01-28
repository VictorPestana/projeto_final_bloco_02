import {
	IsDate,
	IsEmail,
	IsNotEmpty,
	MinLength,
	Validate,
  } from 'class-validator';
  import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
  import { Transform, TransformFnParams, Type } from 'class-transformer';
  
  
  @Entity({ name: 'tb_usuarios' })
  export class Usuario {
	@PrimaryGeneratedColumn()
	id: number;
  
	@IsNotEmpty()
	@Column({ length: 255, nullable: false })
	nome: string;
  
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@IsEmail()
	@IsNotEmpty()
	@Column({ length: 255, nullable: false })
	usuario: string;
  
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@MinLength(8)
	@IsNotEmpty()
	@Column({ length: 255, nullable: false })
	senha: string;
  
	@Column({ length: 5000 })
	foto: string;
	
	@Column()
	@IsDate()
	@Type(() => Date)
	dataNascimento: Date;
  
  
  }
