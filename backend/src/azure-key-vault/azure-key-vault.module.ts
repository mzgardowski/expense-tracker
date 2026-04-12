import { Global, Module } from '@nestjs/common';
import { AzureKeyVaultService } from './azure-key-vault.service';

@Global()
@Module({
  providers: [AzureKeyVaultService],
  exports: [AzureKeyVaultService],
})
export class AzureKeyVaultModule {}
