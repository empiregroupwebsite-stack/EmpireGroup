// Client (developer) logos live in /public/clients.
// `aliases` are lower-case fragments matched against a project's developer name (and, for the
// Clients section, the project name) to link projects to their client.

export interface ClientItem {
  name: string;
  file: string;
  aliases: string[];
}

export const CLIENTS: readonly ClientItem[] = [
  { name: 'Amanora', file: 'amanora.png', aliases: ['amanora', 'city corporation'] },
  { name: 'Amit', file: 'amit.png', aliases: ['amit'] },
  { name: 'Honeywell', file: 'honeywell.png', aliases: ['honeywell'] },
  { name: 'Kolte Patil', file: 'koltpatil.png', aliases: ['kolte'] },
  { name: 'Konark', file: 'konark.png', aliases: ['konark'] },
  { name: 'Kumar', file: 'kumar.png', aliases: ['kumar'] },
  { name: 'Lodha', file: 'lodha.png', aliases: ['lodha'] },
  { name: 'Magarpatta', file: 'magarpatta.png', aliases: ['magarpatta'] },
  { name: 'Marvel', file: 'marvel.png', aliases: ['marvel'] },
  { name: 'Naiknavare', file: 'naiknavare.png', aliases: ['naiknavare'] },
  { name: 'Nanded City', file: 'nandedcity.png', aliases: ['nanded'] },
  { name: 'Paranjape', file: 'paranjape.png', aliases: ['paranjape'] },
  { name: 'Puneville', file: 'puneville.png', aliases: ['puneville', 'pharande'] },
  { name: 'Runwal Seagull', file: 'runwalseagul.png', aliases: ['runwal'] },
  { name: 'Solitare', file: 'solitare.png', aliases: ['solitare', 'solitaire'] },
  { name: 'VTP', file: 'vtp.png', aliases: ['vtp'] },
  { name: 'Xrbia', file: 'xrbia.png', aliases: ['xrbia'] },
];

export const clientLogoSrc = (client: ClientItem) => `/clients/${client.file}`;

export function matchesClient(client: ClientItem, text: string): boolean {
  const lower = text.toLowerCase();
  return client.aliases.some((alias) => lower.includes(alias));
}

/** The client whose logo represents a project's developer, if one exists. */
export function findClientForDeveloper(developer: string): ClientItem | undefined {
  return CLIENTS.find((client) => matchesClient(client, developer));
}
