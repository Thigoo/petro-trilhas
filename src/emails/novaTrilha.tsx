// emails/NovaTrilha.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Preview,
  Section,
  Img,
} from "@react-email/components";

interface NovaTrilhaEmailProps {
  nomeTrilha: string;
  dificuldade: string;
  urlTrilha: string;
  urlImagem: string;
}

// Paleta traduzida do oklch do app para hex (email não suporta oklch)
const colors = {
  lightGreen: "#4ADE80",
  mediumGreen: "#16A34A",
  darkGreen: "#14532D",
  mutedForeground: "#6b7280",
};

export default function NovaTrilhaEmail({
  nomeTrilha,
  dificuldade,
  urlTrilha,
  urlImagem,
}: NovaTrilhaEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Conheça {nomeTrilha} na Petro Trilhas!</Preview>
      <Body
        style={{
          fontFamily: "sans-serif",
          margin: 0,
        }}
      >
        <Container>
          {/* Logo do app, versão email-safe */}
          <Section style={{ marginBottom: "24px" }}>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: colors.darkGreen,
              }}
            >
              Petro
              <span style={{ color: colors.mediumGreen }}>Trilhas</span>
            </span>
          </Section>

          <Heading
            as="h1"
            style={{
              fontSize: "20px",
              color: colors.darkGreen,
              margin: "0 0 16px",
            }}
          >
            Nova trilha cadastrada ⛰️
          </Heading>

          <Text
            style={{
              color: colors.mutedForeground,
              fontSize: "15px",
              lineHeight: "22px",
            }}
          >
            <strong style={{ color: colors.darkGreen }}>{nomeTrilha}</strong>,
            acabou de ser cadastrada.
            <br />
            Dificuldade:{" "}
            <strong style={{ color: colors.darkGreen }}>{dificuldade}</strong>.
          </Text>

          <Img
            src={urlImagem}
            alt={nomeTrilha}
            width="400"
            height="300"
            style={{ marginTop: "16px" }}
          />

          <Button
            href={urlTrilha}
            style={{
              backgroundColor: colors.mediumGreen,
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: 600,
              display: "inline-block",
              marginTop: "8px",
            }}
          >
            Conhecer a trilha
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
