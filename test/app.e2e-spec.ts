import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes dos Módulos Usuario e Auth (e2e)', () => {

  let token: string;
  let usuarioId: number;
  let app: INestApplication;
  let produtoId: number;
  let categoriaId: number;

  beforeAll(async () => {
    jest.setTimeout(10000); 
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + "./../src/**/entities/*.entity.ts"],
          synchronize: true,
          dropSchema: true,
        }),
        AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it("01 - Deve Cadastrar um Novo Produto", async () => {
    const resposta = await request(app.getHttpServer())
      .post('/produtos')
      .send({
        nome: 'Paracetamol 500mg',
        descricao: 'Medicamento utilizado para reduzir febre e aliviar dores leves',
        preco: 10.50,
        imagem: 'https://ik.imagekit.io/hdldh6zer/produtos_farmacia/produto_08.png',
        categoriaId: 1, 
      })
      .expect(201);

    produtoId = resposta.body.id;
  });

  it("02 - Não Deve Cadastrar Produto com Categoria Inexistente", async () => {
    await request(app.getHttpServer())
      .post('/produtos')
      .send({
        nome: 'Produto Teste',
        descricao: 'Descrição de produto',
        preco: 15.00,
        imagem: 'https://link-para-imagem',
        categoriaId: 9999, 
      })
      .expect(400); 
  });

  it("03 - Deve Listar Todos os Produtos", async () => {
    return request(app.getHttpServer())
      .get('/produtos')
      .set('Authorization', `Bearer ${token}`) 
      .expect(200);
  });

  it("04 - Deve Buscar um Produto pelo ID", async () => {
    return request(app.getHttpServer())
      .get(`/produtos/${produtoId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((resposta) => {
        expect(resposta.body.id).toEqual(produtoId);
      });
  });

  it("05 - Deve Atualizar um Produto", async () => {
    return request(app.getHttpServer())
      .put(`/produtos/${produtoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Paracetamol 500mg - Atualizado',
        descricao: 'Descrição atualizada do medicamento',
        preco: 12.00,
        imagem: 'https://link-para-imagem-atualizada',
        categoriaId: 1,
      })
      .expect(200)
      .then((resposta) => {
        expect("Paracetamol 500mg - Atualizado").toEqual(resposta.body.nome);
      });
  });

  it("06 - Deve Listar Todas as Categorias", async () => {
    return request(app.getHttpServer())
      .get('/categorias')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it("07 - Deve Criar uma Nova Categoria", async () => {
    const resposta = await request(app.getHttpServer())
      .post('/categorias')
      .send({
        nome: 'Medicamentos',
      })
      .expect(201);

    categoriaId = resposta.body.id;
  });

  it("08 - Deve Buscar uma Categoria pelo ID", async () => {
    return request(app.getHttpServer())
      .get(`/categorias/${categoriaId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((resposta) => {
        expect(resposta.body.id).toEqual(categoriaId);
      });
  });

  it("09 - Deve Atualizar uma Categoria", async () => {
    return request(app.getHttpServer())
      .put(`/categorias/${categoriaId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Medicamentos Atualizados',
      })
      .expect(200)
      .then((resposta) => {
        expect("Medicamentos Atualizados").toEqual(resposta.body.nome);
      });
  });

  it("10 - Deve Cadastrar um novo Usuário", async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(201)

    usuarioId = resposta.body.id;
  });

  it("11 - Não Deve Cadastrar um Usuário Duplicado", async () => {
    await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(400)
  });

  it("12 - Deve Autenticar o Usuário (Login)", async () => {
    const resposta = await request(app.getHttpServer())
    .post("/usuarios/logar")
    .send({
      usuario: 'root@root.com',
      senha: 'rootroot',
    })
    .expect(200)

    token = resposta.body.token;
  });

  it("13 - Deve Listar todos os Usuários", async () => {
    return request(app.getHttpServer())
    .get('/usuarios/all')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
  });

});

