import { useEffect, useState } from "react";
import { Optional } from "../types/shared";

function convertURIToHTTPSInner({
  url,
  ipfsHost = "https://ipfs.io",
}: {
  url: string | undefined;
  ipfsHost?: string;
}) {
  if (!url) return undefined;
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", `${ipfsHost}/ipfs/`);
  }
  return url;
}

export function convertURIToHTTPS(args: {
  url: string | undefined;
  ipfsHost?: string;
}) {
  const result = convertURIToHTTPSInner(args);

  if (!result)
    throw new Error(`missing result, inputs were, ${JSON.stringify(args)}`);

  return result;
}

export const useHttpsUriForIpfs = (ipfsUrl?: Optional<string>) => {
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (!ipfsUrl) {
      setResult(null);
      return;
    }

    setResult(convertURIToHTTPS({ url: ipfsUrl }));
  }, [ipfsUrl]);

  return result;
};
