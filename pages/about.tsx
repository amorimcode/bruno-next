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
          <h2>Links</h2>
          <ul>
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
          <h2>Bio</h2>
          <h3>Cargo atual</h3>
          <p>Desenvolvedor front-end junior na @mblabs</p>
          <h3>Experiência</h3>
          <h4>
            Desenvolvedor front-end junior / MB Labs (março 2022 – o momento)
          </h4>
          <p>
            Atualmente trabalhando em um projeto de fintech banking as a
            service, fazendo manutenção de código, desenvolvendo novas
            funcionalidades com uma visão de produto relevante, projetando novas
            telas usando figma. Desenvolvimento de aplicações web usando
            React.js e React-native para mobile, também usando testes unitários
            com Jest para um melhor código. Manutenção de código no backend
            NodeJS.
          </p>

          <h4>
            Estagiário em desenvolvimento de software / Energia Automação
            (agosto 2021 – março 2022)
          </h4>
          <p>
            Desenvolvimento de dashboards e data science para usinas geradoras
            de energia - Análise de dados com pandas - Django framework,
            HTML/CSS/Javascript - AWS, Dynamodb - React Native
          </p>

          <h3>Formação acadêmica</h3>
          <h4>
            Engenharia de Software (6º semestre) -{" "}
            <Link href="https://www.puc-campinas.edu.br/graduacao/engenharia-de-software/">
              PUC-Campinas
            </Link>
          </h4>
          <p>
            Graduação em Engenharia de Software, com ênfase em desenvolvimento
            ágil de software, visando uma base sólida em arquitetura, algoritmos
            e métodos ágeis
          </p>
        </div>
      </div>
    </Container>
  );
}
