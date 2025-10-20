# Portal de Notícias ZNN

## 📁 Estrutura de Arquivos

```
projeto/
│
├── index.html          # Página principal do portal
├── admin.html          # Painel administrativo
├── styles.css          # Estilos da página principal
├── admin.css           # Estilos do painel admin
├── script.js           # JavaScript da página principal
├── admin.js            # JavaScript do painel admin
├── README.md           # Este arquivo
│
└── imagens/            # Pasta para armazenar imagens das notícias
    ├── noticia1.jpg
    ├── noticia2.png
    └── ...
```

## 🖼️ Como Usar Imagens

### 1. Criar a Pasta de Imagens

Crie uma pasta chamada **`imagens`** na raiz do projeto (no mesmo nível dos arquivos HTML).

### 2. Adicionar Imagens

Salve suas imagens na pasta `imagens/` com nomes descritivos:
- noticia1.jpg
- esporte-futebol.png
- tecnologia-ia.jpg
- etc.

### 3. No Painel Administrativo

Ao criar/editar uma notícia:

**Campo "Nome da Imagem na Pasta":**
- Digite apenas o nome do arquivo: `noticia1.jpg`
- Não precisa incluir o caminho `imagens/`
- O sistema adiciona automaticamente o prefixo `imagens/`

**Exemplos:**
- ✅ Correto: `noticia1.jpg`
- ✅ Correto: `futebol-brasil.png`
- ❌ Errado: `imagens/noticia1.jpg`
- ❌ Errado: `/imagens/noticia1.jpg`

### 4. Formatos Suportados

- JPG/JPEG
- PNG
- GIF
- WebP
- SVG

## 🔐 Acesso ao Painel Admin

**Senha padrão:** `znn2025`

Para alterar a senha, edite o arquivo `admin.js`:
```javascript
const ADMIN_PASSWORD = 'sua_nova_senha';
```

## 🚀 Como Usar

1. Abra `index.html` no navegador (página principal)
2. Acesse `admin.html` para gerenciar notícias
3. Faça login com a senha
4. Adicione notícias e imagens
5. As notícias aparecerão automaticamente no portal

## 📱 Funcionalidades

- ✅ Design responsivo (mobile, tablet, desktop)
- ✅ Painel administrativo com senha
- ✅ Sistema de edição de notícias
- ✅ Suporte a imagens locais
- ✅ 3 tipos de notícias (Principal, Lateral, Secundária)
- ✅ Categorias personalizadas
- ✅ Armazenamento local (localStorage)

## ⚠️ Observações Importantes

1. **Pasta `imagens`**: Certifique-se de criar a pasta antes de usar
2. **Nomes de arquivo**: Use nomes sem espaços (use hífen ou underscore)
3. **Backup**: As notícias são salvas no localStorage do navegador
4. **Limpar cache**: Se tiver problemas, limpe o cache do navegador

## 🎨 Personalização

### Alterar cores do gradiente:
Edite as opções no `admin.html` em `<select id="imageColor">`

### Adicionar categorias:
Edite as opções em `<select id="category">` no `admin.html`

---

**Desenvolvido para o Portal ZNN** 📰