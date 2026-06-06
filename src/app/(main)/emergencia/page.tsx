"use client";

import { Phone, Shield, AlertTriangle, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Button } from "@/src/components/ui/button";

const emergencyContacts = [
  {
    name: "Bombeiros / Resgate em Montanha",
    number: "193",
    icon: <Shield className="w-5 h-5" />,
    color: "red",
  },
  {
    name: "SAMU",
    number: "192",
    icon: <Phone className="w-5 h-5" />,
    color: "red",
  },
  {
    name: "Polícia Militar",
    number: "190",
    icon: <Phone className="w-5 h-5" />,
    color: "blue",
  },
  {
    name: "Defesa Civil Petrópolis",
    number: "199",
    icon: <AlertTriangle className="w-5 h-5" />,
    color: "orange",
  },
  {
    name: "Disque Denúncia Ambiental",
    number: "0000 000 0000",
    icon: <MapPin className="w-5 h-5" />,
    color: "emerald",
  },
];

export default function EmergenciaPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Emergência</h1>
            <p className="text-slate-600">Números e orientações rápidas</p>
          </div>
        </div>

        {/* Contatos de Emergência - Destaque */}
        <Card className="mb-8 border-red-200 bg-white shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Phone size={22} />
              Contatos de Emergência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <a
                key={index}
                href={`tel:${contact.number.replace(/\D/g, "")}`}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all active:scale-[0.985]"
              >
                <div className="flex items-center gap-4">
                  <div className="text-red-600">{contact.icon}</div>
                  <div>
                    <p className="font-medium text-slate-900">{contact.name}</p>
                    <p className="text-lg font-semibold text-red-600">
                      {contact.number}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200"
                >
                  Ligar
                </Button>
              </a>
            ))}
          </CardContent>
        </Card>

        {/* Orientações por Tipo de Emergência */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle size={20} />
            Orientações por Tipo de Emergência
          </h2>

          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem
              value="desorientacao"
              className="border rounded-2xl px-2"
            >
              <AccordionTrigger>Desorientação ou Perda</AccordionTrigger>
              <AccordionContent className="text-slate-600">
                Fique calmo. Tente voltar pelo mesmo caminho. Use o GPS do app.
                Se possível, suba para um ponto alto para ter melhor sinal e
                visão.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="clima" className="border rounded-2xl px-2">
              <AccordionTrigger>Condições Climáticas Extremas</AccordionTrigger>
              <AccordionContent className="text-slate-600">
                Neblina forte, chuva intensa ou raios são perigosos. Busque
                abrigo seguro. Evite áreas expostas e riachos em caso de chuva
                forte.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="lesao" className="border rounded-2xl px-2">
              <AccordionTrigger>Acidente ou Lesão</AccordionTrigger>
              <AccordionContent className="text-slate-600">
                Avalie a gravidade. Se não conseguir andar, ligue imediatamente
                para o 193 (Bombeiros). Informe sua localização exata.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Dicas de Segurança */}
        <Card>
          <CardHeader>
            <CardTitle>Dicas Rápidas de Segurança</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <div className="flex gap-3">
              <div className="text-emerald-600 mt-0.5">•</div>
              <p>Sempre avise alguém onde você vai e quando pretende voltar.</p>
            </div>
            <div className="flex gap-3">
              <div className="text-emerald-600 mt-0.5">•</div>
              <p>Leve água, lanterna, celular carregado e uma capa de chuva.</p>
            </div>
            <div className="flex gap-3">
              <div className="text-emerald-600 mt-0.5">•</div>
              <p>Evite trilhas após as 15h em dias de chuva ou neblina.</p>
            </div>
            <div className="flex gap-3">
              <div className="text-emerald-600 mt-0.5">•</div>
              <p>Respeite os limites do seu condicionamento físico.</p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500 mt-10">
          Em caso de emergência grave, ligue imediatamente para 193 ou 192.
        </p>
      </div>
    </div>
  );
}
