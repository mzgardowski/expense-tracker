import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

/**
 * Standalone function for use outside NestJS DI (e.g., data-source.ts, scripts).
 * Creates a new credential + client per call — use only at startup.
 */
export async function fetchSecret(
  vaultUrl: string,
  secretName: string,
): Promise<string> {
  const credential = new DefaultAzureCredential();
  const client = new SecretClient(vaultUrl, credential);
  const secret = await client.getSecret(secretName);

  if (!secret.value) {
    throw new Error(
      `Secret "${secretName}" retrieved from Key Vault has no value`,
    );
  }

  return secret.value;
}

@Injectable()
export class AzureKeyVaultService {
  private readonly logger = new Logger(AzureKeyVaultService.name);
  private readonly client: SecretClient;

  constructor(configService: ConfigService) {
    const vaultUrl = configService.getOrThrow<string>('KEY_VAULT_URL');
    const credential = new DefaultAzureCredential();
    this.client = new SecretClient(vaultUrl, credential);
    this.logger.log(`Key Vault client initialized for: ${vaultUrl}`);
  }

  async getSecret(secretName: string): Promise<string> {
    try {
      const secret = await this.client.getSecret(secretName);

      if (!secret.value) {
        throw new Error(`Secret "${secretName}" has no value`);
      }

      this.logger.log(`Successfully retrieved secret: ${secretName}`);
      return secret.value;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to retrieve secret "${secretName}": ${message}`,
      );
      throw error;
    }
  }
}
