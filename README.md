# Studio Ghibli Movie App (TruckPag Challenge)

Aplicação React + TypeScript que consome a API pública do Studio Ghibli e permite organizar filmes com filtros, ordenação, favoritos, status de assistido, anotações e avaliação pessoal.

## Tecnologias utilizadas

- React 18 + TypeScript
- Vite
- Tailwind CSS
- GSAP (animações)
- TanStack Query (estado assíncrono e cache)
- Context API + Reducer (estado global de interações do usuário)
- Vitest (teste unitário)

## Instalação e execução

```bash
npm install
npm run dev
```

Aplicação em: `http://localhost:5173`

## Build de produção

```bash
npm run build
npm run preview
```

## Rodar testes

```bash
npm run test
```

## Requisitos implementados

### Obrigatórios

- [x] Listagem de filmes com imagem, título, ano, duração, sinopse, diretor, produtor e `rt_score`
- [x] Marcar filme como assistido
- [x] Marcar filme como favorito
- [x] Filtro por título
- [x] Busca opcional na sinopse com destaque de texto
- [x] Adicionar anotações por filme
- [x] Adicionar avaliação pessoal de 1 a 5 estrelas
- [x] Filtros por assistido, favorito, com anotação e número de estrelas
- [x] Ordenação crescente/decrescente por título, duração, avaliação pessoal e `rt_score`

### Desejáveis

- [x] TypeScript
- [x] Responsividade básica
- [x] Persistência em localStorage de filmes/cache, status do usuário, filtros e ordenação
- [x] Toasts para marcar/desmarcar assistido/favorito e operações de anotação
- [x] Pelo menos 1 teste unitário
- [x] Separação clara de responsabilidades (componentes, serviços, estado, utilitários)
- [x] Biblioteca de estilo (Tailwind CSS)
- [x] Context API para estado global
- [x] TanStack Query para estado assíncrono

## Estrutura resumida

- `src/services`: consumo da API
- `src/state`: contexto global, reducer e toasts
- `src/components`: componentes de UI
- `src/hooks`: hooks reutilizáveis
- `src/utils`: filtros/ordenação e utilitários de texto
- `src/tests`: testes unitários

## Decisões de implementação

- Persistência dos metadados do usuário por `film.id` em localStorage.
- Cache da lista de filmes também em localStorage para render inicial mais rápida.
- Filtro de estrelas funciona por valor exato (1, 2, 3, 4 ou 5).
- Destaque da busca na sinopse é habilitado apenas quando a opção “Incluir sinopse na busca” está ativa.
