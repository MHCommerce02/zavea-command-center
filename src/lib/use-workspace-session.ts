"use client";

import { useCallback, useEffect, useState } from "react";
import { WorkspaceContext } from "../domain/entities";
import { authProvider, workspaceRepository } from "./container";
import { isError } from "../providers/ports/repositories";

type Status = "checking" | "signed-out" | "resolving-workspace" | "ready" | "error";

export function useWorkspaceSession() {
  const [status, setStatus] = useState<Status>("checking");
  const [workspace, setWorkspace] = useState<WorkspaceContext | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resolveWorkspace = useCallback(async () => {
    setStatus("resolving-workspace");
    const result = await workspaceRepository.resolveWorkspaceForCurrentUser();
    if (isError(result)) {
      setErrorMessage(result.error);
      setStatus("error");
      return;
    }
    setWorkspace(result);
    setStatus("ready");
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const userId = await authProvider.getCurrentUserId();
      if (cancelled) return;
      if (!userId) {
        setStatus("signed-out");
        return;
      }
      await resolveWorkspace();
    })();

    const unsubscribe = authProvider.onAuthStateChange((userId) => {
      if (userId) {
        resolveWorkspace();
      } else {
        setWorkspace(null);
        setStatus("signed-out");
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [resolveWorkspace]);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await authProvider.signInWithPassword(email, password);
    if ("error" in result) {
      setErrorMessage(result.error);
      return result;
    }
    return { userId: result.userId };
  }, []);

  const signOut = useCallback(async () => {
    await authProvider.signOut();
  }, []);

  return { status, workspace, errorMessage, signIn, signOut, retry: resolveWorkspace };
}
