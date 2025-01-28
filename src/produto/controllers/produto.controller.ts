import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ProdutoService } from '../services/produto.services';
import { Produto } from '../entity/produto.entity';

@Controller('/produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Get()
  async findAll(): Promise<Produto[]> {
    return this.produtoService.findAll();
  }

  @Get('/:id')
  async findById(@Param('id') id: number): Promise<Produto> {
    return this.produtoService.findById(id);
  }

  @Get('/nome/:nome')
  async findByNome(@Param('nome') nome: string): Promise<Produto[]> {
    return this.produtoService.findByNome(nome);
  }

  @Get('/descricao/:descricao')
  async findByDescricao(
    @Param('descricao') descricao: string,
  ): Promise<Produto> {
    return this.produtoService.findByDescricao(descricao);
  }

  @Get('/preco/:preco')
  async findByPreco(@Param('preco') preco: number): Promise<Produto[]> {
    return this.produtoService.findByPreco(preco);
  }

  @Post()
  async create(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.create(produto);
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() produto: Produto,
  ): Promise<Produto> {
    return this.produtoService.update(produto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.produtoService.delete(id);
    return { message: 'Produto deletado com sucesso' };
  }
}
