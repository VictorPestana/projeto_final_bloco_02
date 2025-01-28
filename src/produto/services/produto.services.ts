import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, DeleteResult } from 'typeorm';
import { Produto } from '../entity/produto.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
  ) {}

  async findAll(): Promise<Produto[]> {
    return this.produtoRepository.find({
      relations: {
        categoria: true,
      },
    });
  }

  async findById(id: number): Promise<Produto> {
    try {
      const produto = await this.produtoRepository.findOneOrFail({
        where: { id },
        relations: { categoria: true },
      });
      return produto;
    } catch (error) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }
  }
  

  async findByNome(nome: string): Promise<Produto[]> {
    return await this.produtoRepository.find({
      where: {
        nome: ILike(`%${nome}%`),
      },
      relations: {
        categoria: true,
      },
    });
  }

  async findByDescricao(descricao: string): Promise<Produto> {
    let produto = await this.produtoRepository.findOne({
      where: {
        descricao: ILike(`%${descricao}%`),
      },
      relations: {
        categoria: true,
      },
    });

    if (!produto) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }

    return produto;
  }

  async findByPreco(preco: number): Promise<Produto[]> {
    return await this.produtoRepository.find({
      where: {
        preco: preco,
      },
      relations: {
        categoria: true,
      },
    });
  }


  async create(produto: Produto): Promise<Produto> {
    return await this.produtoRepository.save(produto);
  }
  

  async update(produto: Produto): Promise<Produto> {
    let buscaProduto = await this.findById(produto.id);

    if (!buscaProduto || !produto.id) {
      throw new Error('Produto não encontrado');
      HttpStatus.NOT_FOUND;
    }

    return await this.produtoRepository.save(produto);
  }

  async delete(id: number): Promise<DeleteResult> {
    let buscaProduto = await this.findById(id);

    if (!buscaProduto) throw new Error('Produto não encontrado');
    HttpStatus.NOT_FOUND;

    return await this.produtoRepository.delete(id);
  }
}
