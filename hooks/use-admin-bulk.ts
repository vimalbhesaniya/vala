"use client";

import { useCallback } from "react";
import type { BulkActionConfig, BulkRequest } from "@/lib/admin/bulk";
import { useBulkAction } from "@/hooks/use-api";
import { useToast } from "@/components/providers/toast-provider";

type BulkPayload = BulkRequest["payload"];

export function useAdminBulkHandler(
  resource: BulkRequest["resource"],
  getPayload?: (rows: unknown[]) => BulkPayload | undefined
) {
  const { toast } = useToast();
  const bulk = useBulkAction(resource);

  const handleBulkAction = useCallback(
    async (action: BulkActionConfig, rows: { id: string }[]) => {
      if (rows.length === 0) return;

      try {
        const response = await bulk.mutateAsync({
          action: action.id,
          ids: rows.map((row) => row.id),
          payload: getPayload?.(rows),
        });

        toast(response.message);
        if (response.data.failed > 0) {
          toast(
            `${response.data.failed} item${response.data.failed !== 1 ? "s" : ""} could not be updated`,
            "error"
          );
        }
      } catch (error) {
        toast(error instanceof Error ? error.message : "Bulk action failed", "error");
        throw error;
      }
    },
    [bulk, getPayload, toast]
  );

  return {
    handleBulkAction,
    bulkLoading: bulk.isPending,
  };
}
