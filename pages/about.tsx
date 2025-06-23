import Link from "next/link";
import Image from "next/image";

import Container from "../components/Container";

export default function About() {
  return (
    <Container title="Sobre – Bruno Amorim">
      <div className="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16 w-full">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
          Sobre mim
        </h1>
        <div className="mb-8 prose dark:prose-dark leading-6">
          <h2>Contato</h2>
          <ul>
            <li>
              Email: <a href="mailto:bruno.amorim032@gmail.com">bruno.amorim032@gmail.com</a>
            </li>
            <li>
              Cel: (19) 99112-3574
            </li>
            <li>
              GitHub: <a href="https://github.com/amorimcode">@amorimcode</a>
            </li>
            <li>
              Website:{" "}
              <Link href="https://brunoamorim.dev/">https://brunoamorim.dev/</Link>
            </li>
            <li>
              LinkedIn:{" "}
              <a href="https://www.linkedin.com/in/amorim-bruno/">
                https://www.linkedin.com/in/amorim-bruno/
              </a>
            </li>
          </ul>
          
          <h2>Sobre</h2>
          <p>
            Desenvolvedor com 5 anos de experiência profissional em projetos de aplicativos mobile e web de grande escala, 
            utilizando React, React Native, TypeScript, Swift, NodeJS e Golang. Especialista em levar aplicações do zero 
            à publicação nas lojas App Store e Play Store, com foco em alta performance e experiência do usuário (UX). 
            Experiência em arquiteturas modernas, otimização de aplicativos para iOS e integração com APIs e serviços de backend.
          </p>

          <h2>Experiência</h2>
          <h3>
            Senior Software Engineer / B.uni (Janeiro 2025 – Atualmente)
          </h3>
          <p>
            Responsável pelo App e Internet Banking do banco digital B.uni, focado em estudantes. 
            Tecnologias: React Native, React JS, Typescript, Redux.
          </p>

          <h3>
            Desenvolvedor Front-end Pleno / MaisMei (Abril 2024 – Janeiro 2025)
          </h3>
          <p>
            Trabalho dando manutenção e desenvolvendo novas funcionalidades no app MaisMei com serviços para contas PJ. 
            Tecnologias: Swift, SwiftUI, React Native, TypeScript, Expo, MobX, Go Lang, ReactJS.
          </p>

          <h3>
            Desenvolvedor Front-end / MB Labs (Março 2022 – Março 2024)
          </h3>
          <p>
            Trabalhei no projeto Bankeiro, white label bancário com +40 clientes, desenvolvendo novas features e dando 
            manutenção aos projetos de grandes clientes (PaGol, Localiza, Syngenta, entre outros). Responsável técnico 
            por avaliar pull requests do time de front-end e mobile, definir arquitetura e padrões do projeto e 
            criar/gerenciar as lojas dos aplicativos. Através do Jira, eram definidas e refinadas tarefas. Todo o processo 
            de implementação de novas funcionalidades era realizado através de Git Flow e Code Review, e deploy utilizando 
            fluxos CI/CD utilizando BitBucket e serviços AWS. Tecnologias: NextJS, React.js, React Native, TypeScript, 
            Redux, NodeJS, Jest, Firebase, Axios, HTML/CSS/JS, Swift, UI Kit, Swift UI, Gradle, Fastlane.
          </p>

          <h3>
            Estagiário em Desenvolvimento de Software / Energia Automação (Agosto 2021 – Março 2022)
          </h3>
          <p>
            Responsável por criar e manter Dataventus, Software para gerenciamento inteligente de complexos eólicos. 
            Responsável pela manutenção da aplicação WEB e implantação do novo aplicativo Android e iOS. Python, Django, 
            HTML/CSS/JS, Pandas, React Native, Git, Jira e BitBucket.
          </p>

          <h2>Formação Acadêmica</h2>
          <h3>
            Bacharelado em Engenharia de Software -{" "}
            <Link href="https://www.puc-campinas.edu.br/graduacao/engenharia-de-software/">
              PUC-Campinas
            </Link>
          </h3>
          <p>
            Graduado em Junho de 2024. Coeficiente de Rendimento Final: 9. 
            TCC: NitroSpray, ERP para gerenciamento de processos de produção de fábricas de equipamentos médicos.
          </p>

          <h3>Curso de Inglês Avançado - UpTime (Janeiro 2015 – Junho 2024)</h3>
          <p>Inglês fluente.</p>

          <h2>Projetos Destacados</h2>
          <h3>
            PaGol - Gol Linhas Aéreas (Março 2022 – Abril 2024)
          </h3>
          <p>
            Participei do desenvolvimento do aplicativo da conta digital PaGol por intermédio da MB Labs. 
            Tecnologias: Swift, UIKit, React Native, TypeScript.{" "}
            <a href="https://www.pagol.com.br/">https://www.pagol.com.br/</a>
          </p>

          <h3>
            IEQ MVA - Igreja do Evangelho Quadrangular (Junho 2023 – Atualmente)
          </h3>
          <p>
            Aplicativo desenvolvido do 0 dedicado a ser uma extensão da mídia da igreja e ajudar no gerenciamento de 
            demandas internas. Todo App foi desenvolvido por mim além de coletar requisitos com o cliente, design no 
            Figma, configuração de ambiente cloud na Azure e publicação dos apps nas lojas. Tecnologias: React Native, 
            Expo, TypeScript, JavaScript, NodeJS, NestJS.
          </p>

          <h2>Tecnologias</h2>
          <h3>Back-end</h3>
          <p>Node.js, NestJS, Go Lang</p>
          
          <h3>Mobile</h3>
          <p>Swift, UIKit, SwiftUI, React Native</p>
          
          <h3>Front-end</h3>
          <p>React, NextJS, TypeScript, TailwindCSS, LESS, SASS, MaterialUI, Antd, Bootstrap, Vue.js</p>
          
          <h3>Design</h3>
          <p>Figma</p>
          
          <h3>Ferramentas</h3>
          <p>Gradle, Fastlane, GitFlow, Jira, BitBucket</p>
          
          <h3>Arquiteturas</h3>
          <p>MVC, MVVM</p>
          
          <h3>Testes</h3>
          <p>XCTest, Jest, react-testing-library</p>
        </div>
      </div>
    </Container>
  );
}
