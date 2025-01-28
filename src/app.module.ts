import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './produto/entity/produto.entity';
import { CategoriaModule } from './categoria/categoria.module';
import { Categoria } from './categoria/entities/categoria.entity';
import { ProdutoService } from './produto/services/produto.services';
import { ProdutoController } from './produto/controllers/produto.controller';
import { UsuarioModule } from './usuario/usuario.module';
import { Usuario } from './usuario/entities/usuario.entity';
import { UsuarioService } from './usuario/services/usuario.service';
import { UsuarioController } from './usuario/controllers/usuario.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Categoria, Produto, Usuario]),
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
    UsuarioModule,
  ],
  controllers: [ProdutoController, UsuarioController],
  providers: [ProdutoService, UsuarioService],
})
export class AppModule {}

