import { useEffect, useRef } from "react";
import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useFollowerInfo(userId: string, initialState: FollowerInfo) {
  const queryClient = useQueryClient();
  const queryKey = ["followerInfo", userId];
  const hasInitializedRef = useRef(false);
  const lastUserIdRef = useRef(userId);
  const initialStateRef = useRef(initialState);

  // Update ref when initialState changes
  useEffect(() => {
    initialStateRef.current = initialState;
  }, [initialState]);

  const query = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/users/${userId}/followers`).json<FollowerInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  // Sync the query data with server-provided initial state only on mount or userId change
  // This ensures correct state after page refresh without overriding optimistic updates
  useEffect(() => {
    const isNewUser = lastUserIdRef.current !== userId;

    if (!hasInitializedRef.current || isNewUser) {
      // On first mount or when userId changes, sync with server state
      // The server state is the source of truth after page refresh
      queryClient.setQueryData(queryKey, initialStateRef.current);
      hasInitializedRef.current = true;
      lastUserIdRef.current = userId;
    }
  }, [queryClient, queryKey, userId]); // Don't include initialState in deps

  return query;
}
