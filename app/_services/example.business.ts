"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  useExampleCharacterCreate,
  useExampleCharactersList,
} from "@/model/example.service";
import { useExampleStore } from "@/store/example.store";

export function useExampleCharactersBusiness() {
  const queryClient = useQueryClient();

  const alignment = useExampleStore((s) => s.alignment);
  const search = useExampleStore((s) => s.search);
  const newName = useExampleStore((s) => s.newName);
  const setAlignment = useExampleStore((s) => s.setAlignment);
  const setSearch = useExampleStore((s) => s.setSearch);
  const setNewName = useExampleStore((s) => s.setNewName);

  const listQuery = useExampleCharactersList({ alignment, search });
  const items = listQuery.data?.items ?? [];

  const createMutation = useExampleCharacterCreate(
    { alignment },
    {
      onSuccess: async () => {
        setNewName("");
        await queryClient.invalidateQueries({
          queryKey: ["exampleCharacters"],
        });
      },
    },
  );

  return {
    alignment,
    search,
    newName,
    setAlignment,
    setSearch,
    setNewName,
    listQuery,
    items,
    createMutation,
  };
}
