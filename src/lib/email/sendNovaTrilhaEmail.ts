import NovaTrilhaEmail from "@/src/emails/novaTrilha";
import { resend } from "../resend";
import { BASE_URL } from "@/src/constants";
import { getAllUserEmails } from "./getRecipienteEmails";

interface Trilha {
  nome: string;
  dificuldade: string;
  slug: string;
  imagem_url: string;
}

export async function sendNovaTrilhaEmail(trilha: Trilha) {
  const emails = await getAllUserEmails();

  if (emails.length === 0) {
    console.warn("[email] Nenhum destinatário encontrado, pulando envio.");
    return;
  }

  const { error } = await resend.emails.send({
    from: "Petro Trilhas <notificacoes@mail.petrotrilhas.com.br>",
    to: "notificacoes@mail.petrotrilhas.com.br",
    bcc: emails,
    subject: `Tem trilha nova no Petro Trilhas!`,
    react: NovaTrilhaEmail({
      nomeTrilha: trilha.nome,
      dificuldade: trilha.dificuldade,
      urlTrilha: `${BASE_URL}/trilhas/${trilha.slug}`,
      urlImagem: trilha.imagem_url,
    }),
  });

  if (error) {
    console.error("[email] Falha ao enviar notificação de nova trilha:", error);
  }
}
