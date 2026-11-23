import { useEffect, useState } from 'react';
import { clientLogoSrc, findClientForDeveloper, type ClientItem } from '../data/clientsData';

function getInitials(name: string): string {
  return name.split(/\s+/).map((word) => word[0]).join('').slice(0, 2).toUpperCase();
}

/** Logo image with a typographic monogram fallback when the file is missing. */
export function ClientLogo({ client }: { client: ClientItem }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [client.file]);

  if (failed) {
    return (
      <span className="client-monogram" aria-label={`${client.name} logo`} role="img">
        {getInitials(client.name)}
      </span>
    );
  }

  return (
    <img
      src={clientLogoSrc(client)}
      alt={`${client.name} logo`}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

/** Developer logo on a white chip; renders nothing when the developer has no logo. */
export function DeveloperLogo({ developer, className = '' }: { developer: string; className?: string }) {
  const client = findClientForDeveloper(developer);
  if (!client) return null;
  return (
    <span className={`developer-logo ${className}`}>
      <ClientLogo client={client} />
    </span>
  );
}
