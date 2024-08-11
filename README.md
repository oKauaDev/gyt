# GYT - Tenha seus commits escritos por uma IA

**GYT** é uma ferramenta que automatiza a criação de commits no Git usando Inteligência Artificial. Com o GYT, a IA analisa as alterações feitas no código e gera automaticamente uma mensagem de commit apropriada, adicionando os arquivos e realizando o commit. Tudo o que você precisa fazer é dar o `git push` quando necessário.

## Instalação

Para instalar o `gyt`, use o npm:

```bash
npm install -g gyt-ia
```

## Configuração

Após a instalação, você precisa configurar o GYT com a sua API Key de um serviço de IA (OpenAI ou NagaIA). Para isso, utilize o comando:

```bash
gyt login
```

### Exemplo de Configuração

```bash
 gyt login
│
◇  ⚙️  Escolha um serviço: NagaIA
│
◇  🔌 Insira sua API Key para NagaIA: xx-xxxxxxxxxxxxxxxxxxxx
│
◇  🤖  Escolha o seu modelo de IA (se for um modelo pago sua API key deve ter ela comprada): gpt-4o-mini
│
◇  ✅ API Key salva com sucesso.
```

Se desejar remover a configuração de login, use o comando:

```bash
gyt login --remove
```

ou

```bash
gyt login -r
```

## Uso

Com o GYT configurado, gerar um commit é muito simples. Basta usar o comando:

```bash
gyt
```

### Exemplo de Geração de Commit

```bash
 gyt
│
◇  ♻️  refactor(package.json, gyt.js): Removido campo de descrição e comentado código de commit.
│
◇  ❔ Deseja confirmar esse commit? yes
│
◇  📃  Arquivos adicionados ao seu commit com sucesso.
│
◇  🚀  Commit enviado com sucesso.
```

## Contribuição

Contribuições são bem-vindas! Se você quiser colaborar com o projeto, basta enviar um Pull Request (PR) no [repositório GitHub](https://github.com/oKauaDev/gyt).

## Licença

Este projeto está licenciado sob a licença ISC.
