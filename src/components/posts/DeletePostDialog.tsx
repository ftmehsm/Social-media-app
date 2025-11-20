import { PostData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { useDeletePostMutation } from "./mutations";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

interface DeletePostDialogProps {
  post: PostData;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function DeletePostDialog({
  post,
  open,
  onClose,
}: DeletePostDialogProps) {
  const mutation = useDeletePostMutation();
  const t = useTranslations("posts");
  const tCommon = useTranslations("common");

  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }
  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deletePost")}</DialogTitle>
            <DialogDescription>
              {t("deletePostConfirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <LoadingButton
              variant="destructive"
              loading={mutation.isPending}
              onClick={() => mutation.mutate(post.id, { onSuccess: onClose })}
            >
              {tCommon("delete")}
            </LoadingButton>
            <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>
              {tCommon("cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
