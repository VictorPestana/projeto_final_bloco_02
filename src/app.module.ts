import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './produto/entity/produto.entity';
import { CategoriaModule } from './categoria/categoria.module';
import { Categoria } from './categoria/entities/categoria.entity';
import { ProdutoService } from './produto/services/produto.services';
import { ProdutoController } from './produto/controllers/produto.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Categoria, Produto]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'db_farmacia',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CategoriaModule,
  ],
  controllers: [ProdutoController],
  providers: [ProdutoService],
})
export class AppModule {}

