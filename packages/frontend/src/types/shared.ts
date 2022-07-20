export type Optional<T> = T | null;

export enum FileLocationKind {
  ipfs = "ipfs",
  ipfsRelative = "ipfsRelative",
  https = "https",
  blob = "blob",
}

export type FileLocation =
  | {
      url: string;
      kind: FileLocationKind.ipfs | FileLocationKind.https | FileLocationKind.ipfsRelative;
    }
  | {
      kind: FileLocationKind.blob;
      file: File;
    };
