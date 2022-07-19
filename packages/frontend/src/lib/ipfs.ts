import { useEffect, useState } from "react";
import { FileLocation, FileLocationKind, Optional } from "../types/shared";

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

function readFileContents(file: File) {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;

      resolve(binaryStr);
    };
    reader.readAsArrayBuffer(file);
  });
}

export const useHttpsUrl = (file?: Optional<FileLocation>) => {
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setResult(null);
      return;
    }

    if (file.kind === FileLocationKind.ipfs) {
      setResult(convertURIToHTTPS({ url: file.url }));
    } else if (file.kind === FileLocationKind.https) {
      setResult(file.url);
    } else if (file.kind === FileLocationKind.blob) {
      (async () => {
        const fileContents = await readFileContents(file.file);
        if (fileContents) {
          if (typeof fileContents === "string") {
            setResult(fileContents);
          } else {
            const blobUrl = URL.createObjectURL(new Blob([fileContents]));

            setResult(blobUrl);
          }
        }
      })();
    }
  }, [file]);

  return result;
};
