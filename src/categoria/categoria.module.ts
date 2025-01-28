import { Module } from '@nestjs/common';
import { CategoriaService } from './services/categoria.services';
import { CategoriaController } from './controllers/categoria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],
  providers: [CategoriaService],
  controllers: [CategoriaController],
  exports: [TypeOrmModule, CategoriaService],
})
export class CategoriaModule {}
