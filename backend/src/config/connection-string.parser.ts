export interface MssqlConnectionConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  encrypt: boolean;
  trustServerCertificate: boolean;
}

/**
 * Parses an ADO.NET-style MSSQL connection string into individual config fields.
 *
 * Handles formats like:
 *   Server=tcp:myserver.database.windows.net,1433;Initial Catalog=mydb;User ID=user;Password=pass;Encrypt=true;
 */
export function parseMssqlConnectionString(
  connectionString: string,
): MssqlConnectionConfig {
  const params = new Map<string, string>();

  for (const part of connectionString.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.substring(0, eqIndex).trim().toLowerCase();
    const value = trimmed.substring(eqIndex + 1).trim();
    params.set(key, value);
  }

  let host = params.get('server') ?? params.get('data source') ?? '';
  let port = 1433;

  // Handle "tcp:server.database.windows.net,1433" format
  host = host.replace(/^tcp:/i, '');
  if (host.includes(',')) {
    const parts = host.split(',');
    host = parts[0];
    port = parseInt(parts[1], 10);
  }

  return {
    host,
    port,
    username: params.get('user id') ?? params.get('uid') ?? '',
    password: params.get('password') ?? params.get('pwd') ?? '',
    database: params.get('initial catalog') ?? params.get('database') ?? '',
    encrypt: (params.get('encrypt') ?? 'true').toLowerCase() === 'true',
    trustServerCertificate:
      (params.get('trustservercertificate') ?? 'false').toLowerCase() ===
      'true',
  };
}
