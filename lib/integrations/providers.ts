import { INTEGRATION_PROVIDERS } from "@/lib/integrations/catalog";
import type { IntegrationProvider } from "@/types";

export function parseIntegrationProvider(value: string): IntegrationProvider {
  if ((INTEGRATION_PROVIDERS as string[]).includes(value)) {
    return value as IntegrationProvider;
  }
  throw new Error(`Unsupported integration provider: ${value}`);
}
