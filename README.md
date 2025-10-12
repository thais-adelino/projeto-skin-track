# Qual é minha pele? - Análise de Pele Inteligente

Uma aplicação mobile completa para análise de tipo de pele com interface moderna, backend Node.js e banco de dados MySQL.

## 📱 Sobre o Projeto

**Qual é minha pele?** é um aplicativo mobile que oferece uma análise personalizada do tipo de pele através de um questionário interativo. O app determina características da pele e fornece recomendações de produtos personalizadas.

### ✨ Características Principais

- 🎨 **Interface Moderna**: Design inspirado no shadcn com gradientes pastel
- 🤖 **Análise Inteligente**: Questionário interativo para determinar tipo de pele
- 📊 **Estatísticas da Comunidade**: Visualização de dados agregados dos usuários
- 🌐 **Backend Completo**: API REST com Node.js e MySQL
- 📱 **Multiplataforma**: Funciona em iOS, Android e Web
- 🇧🇷 **Totalmente em Português**: Interface completamente traduzida

## 🛠️ Tecnologias Utilizadas

### Frontend (Mobile)
- **React Native 0.79.5** - Framework para desenvolvimento mobile
- **Expo SDK 53** - Plataforma de desenvolvimento React Native
- **TypeScript 5.8.3** - Tipagem estática para JavaScript
- **React 19.0.0** - Biblioteca para interfaces de usuário
- **Expo Router 5.1.5** - Roteamento baseado em arquivos
- **React Navigation 7.0.0** - Navegação entre telas
- **Expo Linear Gradient 14.1.5** - Gradientes lineares
- **Expo Blur 14.1.5** - Efeitos de desfoque
- **React Native Reanimated 3.17.4** - Animações nativas
- **React Native Gesture Handler 2.24.0** - Gestos touch
- **React Native SVG 15.11.2** - Gráficos vetoriais

### Backend (Servidor)
- **Node.js** - Runtime JavaScript
- **Express.js 4.19.2** - Framework web minimalista
- **MySQL 8.0+** - Banco de dados relacional
- **MySQL2 3.6.5** - Cliente MySQL para Node.js
- **CORS 2.8.5** - Compartilhamento de recursos entre origens
- **Nodemon 3.1.4** - Reinicialização automática do servidor

### Desenvolvimento
- **Expo CLI** - Ferramentas de desenvolvimento
- **Metro Bundler** - Empacotador JavaScript
- **Jest 29.2.1** - Framework de testes
- **ESLint** - Linter para JavaScript/TypeScript
- **Yarn** - Gerenciador de pacotes

## 🚀 Como Executar o Projeto

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 22)
- **MySQL Server** (versão 8.0 ou superior)
- **Yarn** (gerenciador de pacotes)
- **Expo CLI** (`npm install -g @expo/cli`)
- **Expo Go** (app no seu celular para testes)

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd whatsmyskintype
```

### 2. Instale as Dependências

```bash
# Instalar dependências do frontend
yarn install

# Instalar dependências do backend (abrir mais um terminal)
cd backend
npm install
brew install mysql

# Configurar banco de dados MySQL
npm run setup
```

### 3. Iniciar Front no terminal do front
```bash
yarn start

```

### 4. Iniciar backend no terminal do back

```bash
npm run dev

```

#### No Celular (Recomendado)
1. Instale o **Expo Go** na App Store ou Google Play
2. Escaneie o QR code que aparece no terminal
3. O app abrirá automaticamente no seu celular

#### No Emulador
- **iOS**: Pressione `i` no terminal (requer Xcode no Mac)
- **Android**: Pressione `a` no terminal (requer Android Studio)
- **Web**: Pressione `w` no terminal

## 📁 Estrutura do Projeto

```
whatsmyskintype/
├── app/                          # Páginas da aplicação (Expo Router)
│   ├── _layout.tsx              # Layout principal
│   ├── (tabs)/                  # Navegação por abas
│   │   ├── _layout.tsx          # Layout das abas
│   │   ├── index.tsx            # Tela inicial
│   │   └── explore.tsx          # Tela explorar
│   └── +not-found.tsx           # Página 404
├── components/                   # Componentes reutilizáveis
│   ├── ui/                      # Componentes de interface
│   │   ├── GradientBackground.tsx
│   │   ├── Card.tsx
│   │   └── IconSymbol.tsx
│   ├── ChatBot.tsx              # Interface do chat
│   ├── NameForm.tsx             # Formulário de nome
│   ├── LoadingScreen.tsx        # Tela de carregamento
│   ├── ProductRecommendations.tsx # Recomendações
│   └── StatisticsPage.tsx       # Página de estatísticas
├── constants/                    # Constantes e configurações
│   ├── Colors.ts                # Cores do tema
│   ├── Config.ts                # Configuração da API
│   ├── Products.ts              # Dados dos produtos
│   └── Questions.ts             # Perguntas do questionário
├── hooks/                       # Hooks customizados
│   ├── useChatLogic.ts          # Lógica do chat
│   ├── useColorScheme.ts        # Tema claro/escuro
│   └── useThemeColor.ts         # Cores do tema
├── backend/                     # Servidor Node.js
│   ├── server.js                # Servidor principal
│   ├── package.json             # Dependências do backend
│   ├── config.js                # Configuração do banco de dados
│   ├── migrate.js               # Script de migração do banco
│   ├── setup-mysql.js           # Script de configuração MySQL
│   └── .env                     # Variáveis de ambiente (criado automaticamente)
├── assets/                      # Recursos estáticos
│   ├── images/                  # Imagens
│   └── fonts/                   # Fontes
├── scripts/                     # Scripts utilitários
│   ├── get-ip.js                # Obter IP do computador
│   └── reset-project.js         # Reset do projeto
├── app.json                     # Configuração do Expo
├── package.json                 # Dependências e scripts
└── tsconfig.json                # Configuração do TypeScript
```

## 🌐 API Endpoints

### POST `/api/users`
Salva dados do usuário após análise de pele.

**Body:**
```json
{
  "name": "Nome do Usuário",
  "skinType": "oily|combination|normal|dry|sensitive",
  "characteristics": {
    "oily": 5,
    "combination": 3,
    "normal": 2,
    "dry": 1,
    "sensitive": 4
  }
}
```

### GET `/api/statistics`
Retorna estatísticas agregadas dos tipos de pele.

**Response:**
```json
{
  "total": 150,
  "statistics": [
    {
      "skin_type": "oily",
      "count": 45,
      "percentage": 30.0
    }
  ]
}
```

## 🎨 Design System

### Cores
- **Gradiente Principal**: `#a5b4fc` → `#c4b5fd` → `#f8bbd9` → `#fed7aa`
- **Texto**: `#ffffff` (branco)
- **Texto Secundário**: `rgba(255, 255, 255, 0.8)`
- **Bordas**: `rgba(255, 255, 255, 0.3)`

### Componentes
- **GradientBackground**: Fundo com gradiente pastel
- **Card**: Cartões com efeito glassmorphism
- **ThemedText**: Texto com suporte a temas
- **ThemedView**: Container com suporte a temas

## 🐛 Solução de Problemas

### Erro de Conexão com Backend
```bash
# Verificar se o backend está rodando
curl http://localhost:3001/api/statistics

# Verificar IP do computador
npm run get-ip

# Atualizar IP em constants/Config.ts
```

### Problemas com Expo Go
- Certifique-se de que o celular e computador estão na mesma rede WiFi
- Reinicie o servidor Expo: `npm start`
- Limpe o cache do Expo Go se necessário

### Problemas de Dependências
```bash
# Limpar cache e reinstalar
rm -rf node_modules yarn.lock
yarn install

# Para o backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

## 📱 Funcionalidades

### 1. Análise de Pele
- Questionário interativo com 8 perguntas
- Algoritmo de pontuação para determinar tipo de pele
- Resultados em tempo real

### 2. Recomendações Personalizadas
- Produtos específicos para cada tipo de pele
- Descrições detalhadas das características
- Interface visual com barras de progresso

### 3. Estatísticas da Comunidade
- Visualização de dados agregados
- Gráficos de distribuição de tipos de pele
- Atualização em tempo real

### 4. Interface Moderna
- Design responsivo para todos os dispositivos
- Animações suaves e transições
- Tema consistente em toda a aplicação

## 🚀 Deploy

### Frontend (Expo)
```bash
# Build para produção
expo build:android
expo build:ios

# Deploy no Expo
expo publish
```

### Backend
```bash
# Usar PM2 para produção
npm install -g pm2
pm2 start backend/server.js --name "skin-analysis-api"
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Entre em contato via email
- Consulte a documentação do Expo: https://docs.expo.dev/

---

**Desenvolvido com ❤️ para ajudar pessoas a descobrirem seu tipo de pele ideal!**# whatsmyskintype
