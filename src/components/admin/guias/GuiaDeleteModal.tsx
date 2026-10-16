import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";

interface GuiaDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nome: string;
  deleting?: boolean;
}

export default function GuiaDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  nome,
  deleting,
}: GuiaDeleteModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o guia{" "}
            <strong>&quot;{nome}&quot;</strong>? Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Sim, excluir
          </AlertDialogAction>
        </AlertDialogFooter>
        {deleting && (
          <p className="text-sm text-muted-foreground">Excluindo...</p>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
