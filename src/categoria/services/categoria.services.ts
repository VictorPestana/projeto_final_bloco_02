import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { Categoria } from '../entities/categoria.entity';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  async findAll(): Promise<Categoria[]> {
    return this.categoriaRepository.find();
  }

  async findById(id: number): Promise<Categoria> {
    let categoria = await this.categoriaRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!categoria) {
      throw new HttpException('Categoria não encontrada', HttpStatus.NOT_FOUND);
    }

    return categoria;

    {
    }
  }

  async findByNome(nome: string): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      where: {
        nome: ILike(`%${nome}%`)
      }
    });
  }

  async findByDescricao(descricao: string): Promise<Categoria> {
    let categoria = await this.categoriaRepository.findOne({
      where: {
        descricao: ILike(`%${descricao}%`),
      },
    });

    if (!categoria) {
      throw new HttpException('Categoria não encontrada', HttpStatus.NOT_FOUND);
    }

    return categoria;
  }

  async create(categoria: Categoria): Promise<Categoria> {
    return this.categoriaRepository.save(categoria);
  }

  async update(categoria: Categoria): Promise<Categoria> {
    let buscaCategoria: Categoria = await this.findById(categoria.id);

    if (!buscaCategoria) {
      throw new HttpException('Categoria não encontrada', HttpStatus.NOT_FOUND);
    }

    return await this.categoriaRepository.save(categoria);
  }

  async delete(id: number): Promise<DeleteResult> {
    let buscaCategoria: Categoria = await this.findById(id);

    if (!buscaCategoria) {
      throw new HttpException('Categoria não encontrada', HttpStatus.NOT_FOUND);
    }

    return await this.categoriaRepository.delete(id);
  }
}
