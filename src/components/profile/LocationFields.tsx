"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import { cn } from "@/src/lib/utils";
import { useEstados } from "@/src/hooks/useStates";
import { useMunicipios } from "@/src/hooks/useCities";

export function LocationFields({
  estado,
  cidade,
  onEstadoChange,
  onCidadeChange,
}: {
  estado: string;
  cidade: string;
  onEstadoChange: (uf: string) => void;
  onCidadeChange: (cidade: string) => void;
}) {
  const { data: estados, isLoading: loadingEstados } = useEstados();
  const { data: municipios, isLoading: loadingMunicipios } = useMunicipios(
    estado || null,
  );
  const [openCidade, setOpenCidade] = useState(false);

  const handleEstadoChange = (uf: string) => {
    onEstadoChange(uf);
    onCidadeChange(""); // limpa a cidade ao trocar de estado
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Estado */}
      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Select
          value={estado}
          onValueChange={handleEstadoChange}
          disabled={loadingEstados}
        >
          <SelectTrigger id="estado" className="bg-white">
            <SelectValue
              placeholder={loadingEstados ? "Carregando..." : "Selecione"}
            />
          </SelectTrigger>
          <SelectContent position="popper">
            {estados?.map((uf) => (
              <SelectItem key={uf.sigla} value={uf.sigla}>
                {uf.sigla}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cidade */}
      <div className="space-y-2 col-span-2">
        <Label htmlFor="cidade">Cidade</Label>
        <Popover open={openCidade} onOpenChange={setOpenCidade}>
          <PopoverTrigger asChild>
            <Button
              id="cidade"
              variant="outline"
              role="combobox"
              disabled={!estado || loadingMunicipios}
              className="w-full justify-between bg-white font-normal"
            >
              {cidade || (loadingMunicipios ? "Carregando..." : "Selecione")}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Buscar cidade..." />
              <CommandList>
                <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                <CommandGroup>
                  {municipios?.map((m) => (
                    <CommandItem
                      key={m.id}
                      value={m.nome}
                      onSelect={() => {
                        onCidadeChange(m.nome);
                        setOpenCidade(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          cidade === m.nome ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {m.nome}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
