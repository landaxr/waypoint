import { useCallback, useEffect, useState } from "react";
import { FilesByPath } from "../types/scene";
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

export const useHttpsUrl = (
  fileLocation: Optional<FileLocation> | undefined,
  files: FilesByPath
) => {
  const [result, setResult] = useState<string | null>(null);

  const [fileForElement, setFileForElement] = useState<File | null>();

  useEffect(() => {
    if (fileLocation?.kind === FileLocationKind.local) {
      const name = fileLocation.path;
      setFileForElement(files[name] || null);
    } else {
      setFileForElement(null);
    }
  }, [fileLocation, files]);

  useEffect(() => {
    if (!fileLocation) {
      setResult(null);
      return;
    }

    const setFileFromBlob = async (file: File) => {
      const fileContents = await readFileContents(file);
      if (fileContents) {
        if (typeof fileContents === "string") {
          setResult(fileContents);
        } else {
          const blobUrl = URL.createObjectURL(new Blob([fileContents]));

          setResult(blobUrl);
        }
      }
    };

    const { kind } = fileLocation;

    if (kind === FileLocationKind.ipfs) {
      setResult(convertURIToHTTPS({ url: fileLocation.url }));
    } else if (kind === FileLocationKind.https) {
      setResult(fileLocation.url);
    } else if (kind === FileLocationKind.local) {
      const file = fileForElement;
      if (file) {
        setFileFromBlob(file);
      } else setResult(null);
    }
  }, [fileLocation, fileForElement]);

  return result;
};
