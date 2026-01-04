import React from "react";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";

type ListLoadingProps = {
  isLoading?: boolean;
};

/**
 * Reusable FlatList footer loading component
 * - Shows a centered spinner when loading
 * - Returns null when not loading
 */
export function ListLoading({ isLoading }: ListLoadingProps) {
  if (!isLoading) return null;

  return (
    <Box className="items-center justify-center py-4">
      <Spinner size="large" />
    </Box>
  );
}
