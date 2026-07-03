import type { ToughLeafClient } from '@toughleaf/platform-sdk';

export type RecipeId =
  | 'lookup'
  | 'login'
  | 'observe'
  | 'update-user'
  | 'observe-company'
  | 'update-company';

export interface RecipeContext {
  baseUrl: string;
  client: ToughLeafClient;
  ensureSignedIn: () => Promise<void>;
}

export interface RecipeDef {
  id: RecipeId;
  title: string;
  desc: string;
  doc: string;
  ticket?: string;
  harness?: string;
  needsAuth: boolean;
  code: string;
  run: (ctx: RecipeContext) => Promise<unknown>;
}
