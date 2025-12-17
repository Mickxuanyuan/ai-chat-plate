"use client";

import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import type {
  Alignment,
  ExampleCreateResponse,
  ExampleListResponse,
} from "./example.interface";
import { http } from "./http";

export const EXAMPLE_CHARACTERS_URL = "/api/example-characters";

export function useExampleCharactersList(
  args: { alignment: Alignment; search: string },
  options?: Omit<
    UseQueryOptions<ExampleListResponse>,
    "queryKey" | "queryFn" | "initialData"
  >,
) {
  return useQuery({
    queryKey: [
      "exampleCharacters",
      "list",
      args.alignment,
      args.search,
    ] as const,
    queryFn: ({ signal }) =>
      http.get<ExampleListResponse>(EXAMPLE_CHARACTERS_URL, {
        query: {
          alignment: args.alignment,
          q: args.search.trim() || undefined,
        },
        signal,
      }),
    ...options,
  });
}

export function useExampleCharacterCreate(
  args: { alignment: Alignment },
  options?: Omit<
    UseMutationOptions<ExampleCreateResponse, Error, string>,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: (name: string) =>
      http.post<ExampleCreateResponse>(EXAMPLE_CHARACTERS_URL, {
        name,
        alignment: args.alignment,
      }),
    ...options,
  });
}
