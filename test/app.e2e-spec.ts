import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from '../src/categoria/entities/categoria.entity';
import { Produto } from '../src/produto/entity/produto.entity';
import { Usuario } from '../src/usuario/entities/usuario.entity';

describe('Testes dos Módulos Usuario e Auth (e2e)', () => {
  let token: string;
  let usuarioId: number;
  let produtoId: number;
  let app: INestApplication;
  let categoria: number;

  beforeAll(async () => {
    jest.setTimeout(20000);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Produto, Usuario, Categoria],
          synchronize: true,
          dropSchema: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    jest.useRealTimers();
  });

  it('01 - Deve Cadastrar um novo Usuário', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
        dataNascimento: '2000-01-01',
      })
      .expect(201);

    usuarioId = resposta.body.id;
  });

  it('02 - Não Deve Cadastrar um Usuário Duplicado', async () => {
    await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
        dataNascimento: '1995-07-23',
      })
      .expect(400);
  });

  it('03 - Deve Autenticar o Usuário (Login)', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({
        usuario: 'root@root.com',
        senha: 'rootroot',
      })
      .expect(200);

    token = resposta.body.token;
  });

  it('04 - Deve Listar todos os Usuários', async () => {
    return request(app.getHttpServer())
      .get('/usuarios')
      .set('Authorization', `${token}`)
      .send({})
      .expect(200);
  });

  it('05 - Deve Cadastrar um Novo Produto', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/produtos')
      .send({
        nome: 'Paracetamol 500mg',
        descricao:
          'Medicamento utilizado para reduzir febre e aliviar dores leves',
        preco: 10.5,
        imagem:
          'https://ik.imagekit.io/hdldh6zer/produtos_farmacia/produto_08.png',
        categoriaId: 1,
      })
      .expect(201);

    produtoId = resposta.body.id;
  });

  it('06 - Deve Listar Todos os Produtos', async () => {
    return request(app.getHttpServer())
      .get('/produtos')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('07 - Deve Buscar um Produto pelo ID', async () => {
    return request(app.getHttpServer())
      .get(`/produtos/${produtoId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((resposta) => {
        expect(resposta.body.id).toEqual(produtoId);
      });
  });
});

