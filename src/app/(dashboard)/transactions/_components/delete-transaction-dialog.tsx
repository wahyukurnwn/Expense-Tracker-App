"use client";

import { AlertDialog, AlertDialogHeader, AlertDialogContent, AlertDialogDescription, AlertDialogAction, AlertDialogFooter, AlertDialogCancel, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import deleteTransactionAction from "../_actions/delete-transaction-action";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionId: string;
}

export const DeleteTransactionDialog = ({ open, setOpen, transactionId }: Props) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteTransactionAction,
    onSuccess: async () => {
      toast.success("Tranasaction deleted successfully!", {
        id: transactionId,
      });

      await queryClient.invalidateQueries({
        queryKey: ["transaction"],
      });
    },

    onError: () => {
      toast.error("Something went wrong!", {
        id: transactionId,
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently delete your transaction!</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Deleting transaction...", {
                id: transactionId,
              });
              deleteMutation.mutate(transactionId);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
