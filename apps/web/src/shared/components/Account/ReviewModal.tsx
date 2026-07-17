import type { OrderItemDto } from "@repo/types/contracts";
import { ImageIcon, Pencil, Star, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";

import { createReview } from "@/shared/actions/reviews/createReview";
import { deleteReview } from "@/shared/actions/reviews/deleteReview";
import { updateReview } from "@/shared/actions/reviews/updateReview";
import { Button } from "@/shared/components/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/shadcn-ui/dialog";
import { Rating, RatingItem } from "@/shared/components/shadcn-ui/rating";
import { Textarea } from "@/shared/components/shadcn-ui/textarea";
import { showNotification } from "@/shared/components/showNotification";
import type { ApiErrorResponse } from "@/shared/types/api/error";

const MAX_CHARS = 500;

function getErrorMessage(error: ApiErrorResponse): string {
  if (typeof error.message === "string") return error.message;
  return "Erro inesperado. Tente novamente.";
}

type ReviewModalMode = "create" | "view" | "edit" | "delete-confirm";

type ReviewModalProps = {
  item: OrderItemDto;
  open: boolean;
  onClose: () => void;
  onReviewChanged?: () => void;
};

export const ReviewModal = ({ item, open, onClose, onReviewChanged }: ReviewModalProps) => {
  const [mode, setMode] = useState<ReviewModalMode>(item.userReview ? "view" : "create");
  const [rating, setRating] = useState(item.userReview?.rating ?? 5);
  const [comment, setComment] = useState(item.userReview?.comment ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [imgError, setImgError] = useState(false);

  const resetToView = useCallback(() => {
    if (item.userReview) {
      setMode("view");
      setRating(item.userReview.rating);
      setComment(item.userReview.comment);
    } else {
      onClose();
    }
  }, [item.userReview, onClose]);

  const handleSubmitReview = useCallback(async () => {
    if (rating < 1) return;
    setSubmitting(true);

    const { error } = await createReview(item.productId, { rating, comment });

    setSubmitting(false);

    if (error) {
      showNotification({ type: "error", title: "Erro", message: getErrorMessage(error) });
      return;
    }

    showNotification({
      type: "success",
      title: "Avaliação enviada!",
      message: "Obrigado por avaliar o produto.",
    });
    onReviewChanged?.();
    onClose();
  }, [rating, comment, item.productId, onReviewChanged, onClose]);

  const handleSaveEdit = useCallback(async () => {
    if (rating < 1) return;
    setSubmitting(true);

    const { error } = await updateReview(item.productId, { rating, comment });

    setSubmitting(false);

    if (error) {
      showNotification({ type: "error", title: "Erro", message: getErrorMessage(error) });
      return;
    }

    showNotification({ type: "success", title: "Avaliação atualizada!", message: "Sua avaliação foi atualizada com sucesso." });
    onReviewChanged?.();
    onClose();
  }, [rating, comment, item.productId, onReviewChanged, onClose]);

  const handleDelete = useCallback(async () => {
    setSubmitting(true);

    const { error } = await deleteReview(item.productId);

    setSubmitting(false);

    if (error) {
      showNotification({ type: "error", title: "Erro", message: getErrorMessage(error) });
      return;
    }

    showNotification({ type: "success", title: "Avaliação excluída!", message: "Sua avaliação foi removida com sucesso." });
    onReviewChanged?.();
    onClose();
  }, [item.productId, onReviewChanged, onClose]);

  const dialogTitle =
    mode === "create"
      ? "Avaliar Produto"
      : mode === "view"
        ? "Sua Avaliação"
        : mode === "edit"
          ? "Editar Avaliação"
          : "Excluir Avaliação";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        {mode === "delete-confirm" ? (
          <div className="space-y-4 p-6">
            <p className="text-muted-foreground text-sm">
              Tem certeza que deseja excluir sua avaliação? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMode("view")}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="size-4" />
                Sim, excluir
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 p-6 pb-0">
            {/* Product Card */}
            <div className="rounded-lg border p-3">
              <div className="flex gap-3">
                <div className="bg-muted flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md">
                  {!imgError ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="size-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <ImageIcon className="text-muted-foreground size-5" />
                  )}
                </div>
                <div className="flex min-w-0 flex-col items-start justify-start">
                  <p className="text-sm leading-tight font-medium">{item.productName}</p>
                  {item.variantLabel && (
                    <p className="text-muted-foreground text-xs">{item.variantLabel}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="mb-2 block text-sm font-medium">Sua nota:</label>
              <div className="flex items-center gap-2">
                <Rating
                  value={rating}
                  onValueChange={setRating}
                  max={5}
                  step={1}
                  readOnly={mode === "view"}
                  className="gap-1 text-yellow-400"
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <RatingItem key={i}>
                      <Star className="size-6" />
                    </RatingItem>
                  ))}
                </Rating>
                <span className="text-sm font-medium">{rating}/5</span>
              </div>
            </div>

            {/* Comment */}
            {mode === "view" ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Seu comentário</label>
                <p className="text-muted-foreground bg-muted/30 min-h-10 rounded-lg border p-3 text-sm leading-relaxed">
                  {item.userReview?.comment || "Sem comentário."}
                </p>
                {item.userReview && (
                  <p className="text-muted-foreground text-right text-xs">
                    {new Date(item.userReview.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Seu comentário</label>
                <Textarea
                  placeholder={
                    mode === "edit"
                      ? "Edite sua avaliação..."
                      : "Conte sua experiência com o produto..."
                  }
                  value={comment}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= MAX_CHARS) setComment(value);
                  }}
                  rows={4}
                  maxLength={MAX_CHARS}
                  disabled={submitting}
                />
                <p className="text-muted-foreground text-right text-xs tabular-nums">
                  {comment.length}/{MAX_CHARS}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer Buttons */}
        {mode !== "delete-confirm" && (
          <div className="bg-muted/50 mt-5 flex items-center justify-end gap-2 px-6 py-4">
            {mode === "view" ? (
              <>
                <Button variant="destructive" onClick={() => setMode("delete-confirm")}>
                  <Trash2 className="size-4" />
                  Excluir
                </Button>
                <Button variant="outline" onClick={() => setMode("edit")}>
                  <Pencil className="size-4" />
                  Editar
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={resetToView} disabled={submitting}>
                  Cancelar
                </Button>

                <Button
                  onClick={mode === "edit" ? handleSaveEdit : handleSubmitReview}
                  disabled={rating < 1 || submitting}
                >
                  {submitting
                    ? "Enviando..."
                    : mode === "edit"
                      ? "Salvar Alterações"
                      : "Enviar Avaliação"}
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
