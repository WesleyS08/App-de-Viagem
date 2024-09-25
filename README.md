# Roteiro de Viagem Automático com React Native e Google Generative AI

Este projeto é uma aplicação mobile desenvolvida com **React Native** que permite ao usuário gerar um roteiro detalhado de viagem para qualquer cidade escolhida. Utilizando a **API do Google Generative AI (Gemini)**, a aplicação gera informações úteis como eventos, valores de passagens, pratos típicos e mais, dependendo da cidade e do período selecionados.

## Funcionalidades

- **Entrada da cidade de destino**: O usuário pode inserir a cidade para a qual deseja criar um roteiro.
- **Calendário interativo**: O usuário pode selecionar o período da viagem utilizando um calendário interativo.
- **Gerar roteiro**: A aplicação se conecta à API do Google Generative AI (Gemini) para gerar automaticamente um roteiro de viagem.
- **Resetar o formulário**: Função para limpar todos os campos e iniciar uma nova pesquisa.
- **Interface amigável**: Uso de componentes visuais e ícones para melhorar a experiência do usuário.

## Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile.
- **Expo**: Plataforma que facilita o desenvolvimento e execução de apps em React Native.
- **Google Generative AI (Gemini)**: API que utiliza inteligência artificial generativa para fornecer textos com base em um prompt.
- **react-native-calendars**: Biblioteca para exibir e interagir com calendários no app.
- **@react-native-community/slider**: Componente para seleção do número de dias da viagem.
- **React Hooks**: Para gerenciamento de estado com `useState`.
- **Material Icons**: Ícones para melhorar a UX.

## Instalação

Siga os passos abaixo para rodar o projeto localmente:

1. Clone o repositório:

    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    ```

2. Instale as dependências:

    ```bash
    cd seu-repositorio
    npm install
    ```

3. Execute o projeto com Expo:

    ```bash
    expo start
    ```

4. Escaneie o QR Code com o aplicativo do Expo Go no seu dispositivo móvel ou utilize um emulador Android/iOS.

## Uso

1. **Insira a cidade**: No campo de entrada, insira a cidade e o estado (ex: "São Paulo, SP").
2. **Escolha o número de dias**: Use o slider para selecionar quantos dias você ficará na cidade.
3. **Selecione datas no calendário**: Como alternativa ao slider, você pode selecionar o período de sua viagem clicando em "Mostrar Calendário".
4. **Gerar roteiro**: Clique no botão "Gerar roteiro" e aguarde a resposta da API do Google Generative AI (Gemini) com um plano de viagem detalhado.
5. **Verifique o roteiro gerado**: O roteiro será exibido abaixo, com informações como eventos, custos e recomendações locais.
6. **Resetar**: Para começar uma nova pesquisa, clique no botão de reset.

## Exemplo de Uso

Ao inserir a cidade "São Paulo, SP" e escolher um período de 5 dias, o aplicativo consultará a API do Google Generative AI (Gemini) e fornecerá um roteiro incluindo eventos, preços de passagens, sugestões de pratos típicos e muito mais.

## Dependências

Certifique-se de que todas as dependências estejam instaladas corretamente:

- `react-native`
- `@react-native-community/slider`
- `react-native-calendars`
- `expo`
- `@google/generative-ai`
- `@expo/vector-icons`

## Recursos e Inspiração

Este projeto foi inspirado pelo tutorial do [YouTube](https://www.youtube.com/watch?v=shG_y39KBcs&t=265s) que apresenta a construção de uma aplicação mobile com integração a APIs externas.

## Licença

Este projeto está sob a licença MIT. Para mais detalhes, consulte o arquivo [LICENSE](./LICENSE).
