import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ProdutoController } from "./controllers/produto.controller";
import { ProdutoService } from "./services/produto.services";
import { Produto } from "./entity/produto.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Produto])],
  controllers: [ProdutoController],
  providers: [ProdutoService],
  exports: [TypeOrmModule, ProdutoService],
})
export class ProdutoModule {}

