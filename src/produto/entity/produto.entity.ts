import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Categoria } from '../../categoria/entities/categoria.entity';
import { NumericTransformer } from '../../util/numerictransformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column()
  nome: string;

  @Column()
  descricao: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @IsPositive()
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new NumericTransformer(),
  })
  preco: number;

  @IsNotEmpty()
  @Column({ length: 2555, nullable: false })
  imagem: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.produtos)
  @JoinColumn({ name: 'categoriaId' })  
  categoria: Categoria;
}

