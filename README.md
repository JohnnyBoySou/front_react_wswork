# Sistema de Gerenciamento de Veículos

Sistema web desenvolvido em React para gerenciamento completo de marcas, modelos e carros. Permite cadastrar, visualizar, editar e excluir informações de veículos de forma intuitiva e organizada.

## 🚀 Funcionalidades

- **Gerenciamento de Marcas**: Cadastre e gerencie marcas de veículos
- **Gerenciamento de Modelos**: Associe modelos às marcas cadastradas
- **Gerenciamento de Carros**: Registre carros completos com marca, modelo, cor, placa e ano
- **Dashboard Interativo**: Visualize todos os dados organizados em abas com contadores
- **Filtros por Marca**: Filtre carros por marca específica
- **Interface Moderna**: Design responsivo e intuitivo com Tailwind CSS
- **Validação de Formulários**: Validação robusta usando Zod e React Hook Form

## 🛠️ Tecnologias Utilizadas

- **React 19** - Biblioteca para construção da interface
- **TypeScript** - Tipagem estática para maior segurança
- **Vite** - Build tool moderna e rápida
- **React Router** - Gerenciamento de rotas
- **Tailwind CSS** - Framework CSS utilitário
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas
- **Axios** - Cliente HTTP para consumo de API
- **Hugeicons React** - Biblioteca de ícones

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- NPM ou Yarn

## ⚙️ Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositório>
```

2. Entre na pasta do projeto:
```bash
cd front_react_wswork
```

3. Instale as dependências:
```bash
npm install
```

## 🎯 Scripts Disponíveis

### `npm run dev`

Executa a aplicação em modo de desenvolvimento.\
Abra [http://localhost:5173](http://localhost:5173) para visualizar no navegador.

A página recarrega automaticamente quando você faz alterações.\
Você também verá erros de lint no console.

### `npm run build`

Compila a aplicação para produção na pasta `dist`.\
Otimiza o build para melhor performance.

O build é minificado e os arquivos incluem hashes.\
Sua aplicação está pronta para deploy!

### `npm run preview`

Visualiza a versão de produção localmente após o build.\
Útil para testar o build de produção antes do deploy.

### `npm run lint`

Executa o linter (ESLint) para verificar problemas no código.\
Ajuda a manter a qualidade e consistência do código.

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── brand/          # Componentes de marcas
│   ├── model/          # Componentes de modelos
│   └── car/            # Componentes de carros
├── routes/             # Páginas/Rotas da aplicação
│   ├── dashboard/      # Dashboard principal
│   ├── brands/         # Rotas de marcas
│   ├── models/         # Rotas de modelos
│   └── cars/           # Rotas de carros
├── services/           # Serviços de API
│   ├── brand.ts        # Serviço de marcas
│   ├── models.ts       # Serviço de modelos
│   ├── cars.ts         # Serviço de carros
│   └── fetch.ts        # Configuração HTTP
└── index.tsx           # Ponto de entrada da aplicação
```

## 🔗 API

Este projeto consome uma API REST para gerenciar os dados. Configure a URL base da API no arquivo de serviços (`services/fetch.ts`).

## 🎨 Interface

A aplicação possui uma interface moderna e responsiva com:
- Cards visuais para cada entidade (marcas, modelos, carros)
- Sistema de abas para navegação entre seções
- Modais para criação e edição de dados
- Estados de loading e empty state
- Confirmações para ações destrutivas

## 📝 Licença

Este projeto é privado e de uso interno
