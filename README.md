<a id="top"></a>

![Banner do Projeto Integrador](./docs/assets/logo.png)

<table align="center" width="100%">
  <tr>
    <td align="center" width="20%">
      <a href="#o-grupo"><b>O GRUPO</b></a>
    </td>
    <td align="center" width="20%">
      <a href="#os-fundamentos"><b> OS FUNDAMENTOS</b></a>
    </td>
    <td align="center" width="20%">
      <a href="#o-projeto"><b>O PROJETO</b></a>
    </td>
    <td align="center" width="20%">
      <a href="#o-manual"><b>O MANUAL (GIT)</b></a>
    </td>
    <td align="center" width="20%">
      <a href="#licenca"><b>LICENÇA</b></a>
    </td>
  </tr>
</table>

--- 

>**FACULDADE:** Fatec Franca - Faculdade de Tecnologia de Franca Dr Thomaz Novelino

>**CURSO:** ADS (Análise e Desenvolvimento de Sistemas) 

>**PERÍODO:** Noturno / 3° Semestre

>**MATÉRIA:** Gestão de Projetos Ágeis 

>**PROFESSOR:** Leonardo Araújo Batista 

---
<a id="o-grupo"></a>
### O GRUPO

<table align="center">
  <tr>
    <td align="center" width="180px">
      <img src="./docs/assets/person_vitor.jpg" width="80px" style="border-radius:50%;"><br>
      <b>Vitor Gabriel Dos Reis Glegorio</b><br>
      <sub>P.O / Backend</sub>
    </td>
    <td align="center" width="180px">
      <img src="./docs/assets/person_vinicius.jpg" width="80px" style="border-radius:50%;"><br>
      <b>Vinicius de Souza Salviano</b><br>
      <sub>Banco de Dados</sub>
    </td>
    <td align="center" width="180px">
      <img src="./docs/assets/person_khelvin.jpg" width="80px" style="border-radius:50%;"><br>
      <b>Khelvin Willian Barbosa Ribeiro</b><br>
      <sub>Banco de Dados</sub>
    </td>
    <td align="center" width="180px">
      <img src="./docs/assets/person_luis.jpg" width="80px" style="border-radius:50%;"><br>
      <b>Luís Felipe Carvalho de Souza</b><br>
      <sub>Frontend</sub>
    </td>
    <td align="center" width="180px">
      <img src="./docs/assets/person_brendon.jpg" width="80px" style="border-radius:50%;"><br>
      <b>Brendon Heitor Bessa Silva</b><br>
      <sub>Frontend</sub>
    </td>
  </tr>
</table>

---
<a id="os-fundamentos"></a>
### OS FUNDAMENTOS

<table>
  <tr>
    <td width="33%" valign="top" align="justify">
      <h3>Missão</h3>
      <p>Contribuir para a formação de caráter de crianças, promovendo um tempo de qualidade que combina lazer, aprendizado e o fortalecimento de valores éticos, preparando-as para um futuro mais consciente e promissor.</p>
    </td>
    <td width="33%" valign="top" align="justify">
      <h3>Visão</h3>
      <p>Expandir de forma sustentável as atividades do projeto para impactar positivamente um número crescente de crianças, levando as ferramentas do esporte, lazer e princípios éticos como meio de inclusão e desenvolvimento pessoal</p>
    </td>
    <td width="33%" valign="top" align="justify">
      <h3>Valores</h3>
      <p>Os valores fundamentais transmitidos às crianças são: o respeito aos colegas e aos pais, além do incentivo para que sonhem em se tornar adultos dignos e íntegros no futuro.</p>
    </td>
  </tr>
</table>

<div align="right">
  <a href="#top">Voltar ao Topo</a>
</div>

---
<a id="o-projeto"></a>
### O PROJETO

O presente projeto descreve o sistema desenvolvido por um grupo de estudantes do curso de Análise e Desenvolvimento de Sistemas da Faculdade de Tecnologia de Franca, designado para criar uma plataforma digital robusta e integrada, concebida para atender às necessidades estratégicas e operacionais da ONG Valentes de Davi. A solução visa modernizar a gestão interna e ampliar a visibilidade externa da organização, superando desafios como a gestão manual de dados, a baixa visibilidade de marketing e a vulnerabilidade na segurança das informações.

### OS OBJETIVOS

O projeto busca resolver as fraquezas identificadas na ONG (gestão manual, risco de segurança e baixa visibilidade online) através dos seguintes objetivos específicos:
- Digitalizar 100% do Processo de Cadastro: Eliminar formulários de papel, permitindo o preenchimento de dados do assistido e responsável, anexo de documentos digitais, geração e armazenamento do Termo de Responsabilidade e criação de matrícula única.
- Automatizar o Controle de Frequência: Fornecer aos Voluntários uma ferramenta digital para registrar presença/falta em aula de forma ágil.
- Habilitar a Gestão Proativa de Evasão: Criar mecanismos automáticos de alerta para a Diretoria, disparando notificações quando o aluno atinge um limite predefinido de faltas.

<div align="right">
  <a href="#top">Voltar ao Topo</a>
</div>

---

<a id="o-manual"></a>
### O MANUAL (GIT)

Este manual explica como baixar o projeto, trabalhar em uma tarefa e enviar suas alterações para revisão. **Faça a configuração inicial uma vez. Depois, escolha entre começar uma tarefa nova ou continuar uma tarefa existente.**

#### Entenda os termos

| Termo | O que significa |
| :--- | :--- |
| Git | Programa que controla o histórico de alterações no seu computador. |
| GitHub | Site onde o grupo compartilha o repositório e revisa as alterações. |
| `main` | Branch principal, que reúne o trabalho aprovado do grupo. |
| Branch | Linha de trabalho separada para desenvolver uma tarefa. |
| Commit | Registro local das alterações que você selecionou. Não envia nada ao GitHub. |
| Push | Envio dos commits locais para o GitHub. |
| Pull Request (PR) | Pedido para revisar e integrar as alterações de uma branch em outra. |
| Merge | Integração das alterações de uma branch em outra. |

#### 1. Configuração inicial — faça uma vez

**Instale e confira o Git.** Baixe pelo [site oficial do Git](https://git-scm.com/downloads). No Windows, você pode usar o Git Bash ou o terminal do VS Code (PowerShell). Depois de instalar, reabra o terminal e execute:

```bash
git --version
```

Se aparecer a versão instalada, continue.

**Configure a autoria dos commits.** Substitua os exemplos pelo seu nome e por um e-mail associado à sua conta do GitHub (pode ser o endereço `noreply` disponível nas configurações de e-mail do GitHub):

```bash
git config --global user.name "Seu Nome Completo"
git config --global user.email "seu-email@example.com"
```

Esses comandos definem a autoria dos commits; não fazem login. A opção `--global` aplica essa identidade aos seus repositórios neste computador.

**Baixe o projeto.** Abra o terminal na pasta onde deseja guardar o projeto e execute:

```bash
git clone https://github.com/fatec-valentes-de-davi-grupo-04/Projeto-Integrador-Grupo-04.git
cd Projeto-Integrador-Grupo-04
```

Se você já clonou o projeto, apenas abra a pasta existente. Não é necessário clonar novamente.

> Execute os próximos comandos dentro dessa pasta. Para enviar alterações, sua conta precisa ter acesso de escrita ao repositório. Se o Git solicitar autenticação, conclua o login pelo gerenciador de credenciais/navegador. A senha da conta do GitHub não serve como senha do Git via HTTPS.

#### 2. Começar uma tarefa nova

**Confira se há trabalho pendente:**

```bash
git status
```

Antes de trocar de branch, o resultado deve indicar que não há alterações pendentes (`working tree clean`). Se houver arquivos alterados, finalize e registre o trabalho na branch correspondente antes de continuar. Se você começou por engano na `main`, consulte “Problemas comuns” abaixo.

**Atualize a `main` e crie uma branch para a tarefa:**

```bash
git switch main
git pull --ff-only origin main
git switch -c feature/tela-login
```

`feature/tela-login` é um exemplo: use um nome que descreva sua tarefa, seguindo a tabela de nomenclaturas no fim do manual. Use esse mesmo nome nos próximos comandos. O `--ff-only` evita que a atualização crie um merge inesperado; se o comando falhar, pare e confira a causa antes de continuar.

**Pronto: faça suas alterações no editor e salve os arquivos.** Uma branch deve representar uma tarefa; não é necessário criar outra a cada dia de trabalho.

#### 3. Registrar e enviar suas alterações

**Confira a branch atual e revise o que mudou:**

```bash
git status
git diff
```

O `git status` mostra a branch e os arquivos alterados. O `git diff` mostra mudanças ainda não preparadas em arquivos já rastreados; abra os arquivos novos no editor para revisá-los. Confira o resultado do seu trabalho e execute os testes aplicáveis antes de enviar.

**Selecione os arquivos do commit.** Para uma alteração apenas no README, por exemplo:

```bash
git add README.md
```

Substitua `README.md` pelos caminhos dos arquivos da sua tarefa. Se quiser incluir todas as alterações da pasta atual e de suas subpastas, incluindo exclusões, use `git add .` após revisar a lista. Arquivos ignorados pelo Git não são incluídos normalmente. Não adicione senhas, tokens ou arquivos locais de configuração com credenciais.

**Confira o que foi selecionado e faça o commit:**

```bash
git diff --cached
git commit -m "docs: melhora o manual do Git"
```

A mensagem acima corresponde ao exemplo do README. Para uma tela de login, poderia ser `feat: cria tela de login`. Descreva o que você realmente alterou.

**Envie a branch ao GitHub pela primeira vez:**

```bash
git push -u origin feature/tela-login
```

Substitua pelo nome da sua branch. O `-u` vincula a branch local à branch remota; nos próximos envios dela, basta usar `git push`.

> Commit salva no histórico local. Push compartilha os commits no GitHub. Nenhum dos dois integra automaticamente seu trabalho à `main`.

#### 4. Abrir o Pull Request e pedir revisão

1. Abra o [repositório no GitHub](https://github.com/fatec-valentes-de-davi-grupo-04/Projeto-Integrador-Grupo-04).
2. Clique em **Compare & pull request**, se aparecer. Caso contrário, entre em **Pull requests → New pull request**.
3. Confira a direção: **base: `main`** (destino) e **compare: sua branch** (origem).
4. Escreva um título claro e explique o que mudou e como você verificou o resultado.
5. Confira os arquivos e commits incluídos. Se aparecer trabalho que não pertence à tarefa, revise antes de prosseguir.
6. Clique em **Create pull request** e solicite a revisão de um ou dois colegas em **Reviewers**, quando disponível.

**Para quem revisa:** confira a aba **Files changed**, avalie o funcionamento quando aplicável e envie a revisão em **Review changes**, usando **Approve** para aprovar ou **Request changes** para pedir ajustes.

**Aprovar e fazer merge são ações diferentes.** Depois da aprovação e das verificações exigidas pelo repositório, a pessoa responsável, com permissão, faz o merge pelo botão disponível e confirma a operação. A aprovação, sozinha, não integra o código à `main`.

Se pedirem ajustes, altere os arquivos na **mesma branch**, faça outro commit e execute `git push`. O PR aberto é atualizado automaticamente; não crie outro PR para esses ajustes.

#### 5. Continuar uma tarefa existente

Use este caminho quando sua tarefa ainda não foi integrada à `main`.

Confira `git status` e resolva alterações pendentes antes de trocar de branch. Depois:

```bash
git switch feature/tela-login
```

Se a branch já foi enviada ao GitHub e tem o vínculo configurado com `-u`, atualize-a:

```bash
git pull --ff-only
```

Esse comando atualiza sua branch com a versão dela no GitHub; não traz automaticamente as novidades da `main`. Se a branch ainda existe apenas no seu computador, pule esse comando.

Continue editando e repita a etapa 3 para revisar, selecionar arquivos e fazer commit. Se já fez o primeiro envio com `-u`, envie os novos commits com:

```bash
git push
```

#### 6. Depois que o PR for integrado

Confirme no GitHub que o PR está marcado como **Merged**. Com o trabalho local salvo em commits e enviado, volte à branch principal e atualize:

```bash
git switch main
git pull --ff-only origin main
```

Opcionalmente, apague a branch local da tarefa concluída:

```bash
git branch -d feature/tela-login
```

Esse comando apaga somente a branch local. Se o Git recusar a exclusão, mantenha a branch e confira o PR e seus commits; isso também pode acontecer após um *squash merge*. Não force a exclusão sem conferir se há trabalho que precisa ser preservado.

Para a próxima tarefa, crie uma nova branch a partir da `main` atualizada, como na etapa 2.

#### Problemas comuns

| Situação | Como agir |
| :--- | :--- |
| `git` não é reconhecido | Instale o Git, reabra o terminal e confira `git --version`. |
| `not a git repository` | Abra o terminal dentro da pasta clonada do projeto. |
| A branch já existe | Use `git switch nome-da-branch` para continuar nela, ou escolha outro nome se for uma tarefa nova. |
| `nothing to commit` | Salve os arquivos no editor e confira `git status`. Talvez não haja mudanças novas ou falte selecioná-las com `git add`. |
| Não consegue autenticar ou recebe `403` ao enviar | Confira a conta usada no login e peça ao responsável pelo repositório para verificar seu acesso de escrita. |
| O push foi rejeitado ou o pull não permite fast-forward | Não use `--force`. Confira `git status` e peça ajuda ao grupo para conciliar os históricos sem perder commits. |
| O Git impede a troca de branch por alterações locais | Registre o trabalho na branch correta antes de trocar; não descarte arquivos para contornar o aviso. |

**Comecei a editar na `main`, mas ainda não fiz commit.** Crie a branch da tarefa antes de registrar as alterações:

```bash
git switch -c feature/minha-tarefa
```

As alterações locais acompanham a nova branch. Continue pela etapa 3. Se já fez commits na `main`, peça ajuda ao grupo para transferi-los sem perder trabalho.

**O PR tem conflitos com a `main`.** Primeiro, na branch da tarefa, salve e registre suas alterações pendentes. Com `git status` indicando que não há alterações pendentes, execute:

```bash
git fetch origin
git merge origin/main
```

Se houver conflitos, o Git informará os arquivos. Abra cada um, combine as alterações necessárias e remova os marcadores `<<<<<<<`, `=======` e `>>>>>>>`. Confira o resultado com o colega responsável pelo trecho em caso de dúvida. Depois de resolver e testar, selecione os arquivos resolvidos com `git add caminho-do-arquivo`, execute `git commit` e envie com `git push`.

Se o merge terminar automaticamente, basta conferir o resultado e enviar com `git push`. Se precisar cancelar uma tentativa de merge ainda em andamento, use `git merge --abort` antes de fazer o commit de resolução.

#### Nomenclaturas do grupo

Use nomes de branches sem espaços e sem acentos, com palavras separadas por hífen.

| Tipo de tarefa | Exemplo de branch | Exemplo de mensagem de commit |
| :--- | :--- | :--- |
| Nova funcionalidade | `feature/cadastro-assistido` | `feat: cria cadastro de assistido` |
| Banco de dados | `db/tabela-frequencia` | `db: cria tabela de frequencia` |
| Correção de erro | `fix/conexao-mysql` | `fix: corrige conexao com o banco` |
| Documentação | `docs/atualiza-readme` | `docs: atualiza manual do Git` |

O escopo é opcional: `feat(ui): cria tela de login` também é válido. O prefixo `db` é uma convenção adotada pelo grupo para alterações de banco de dados.

**Combinado do grupo:** desenvolva em uma branch por tarefa, envie um PR para a `main` e aguarde revisão antes do merge. Não faça push diretamente para a `main`.

<div align="right">
  <a href="#top">Voltar ao Topo</a>
</div>

--- 
<a id="licenca"></a>
### LICENÇA

Este projeto está licenciado sob a Licença **MIT** — consulte o arquivo [LICENSE](LICENSE) para obter mais detalhes.

<p align="left">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge&logo=mit&logoColor=white" alt="Licença MIT" />
</p>

> **O que a Licença MIT permite?**
> * **Uso Comercial:** O código pode ser utilizado em projetos comerciais.
> * **Modificação:** Você pode alterar e adaptar o código-fonte livremente.
> * **Distribuição:** É permitido compartilhar e redistribuir o código original ou modificado.
> * **Uso Privado:** Pode ser executado e mantido em ambientes privados/internos.
> 
> *ℹ️ **Condição:** Manter os créditos originais dos desenvolvedores (Vitor, Vinicius, Khelvin, Luís e Brendon) e da Fatec Franca em todas as cópias ou partes do código.*

<div align="right">
  <a href="#top">Voltar ao Topo</a>
</div>