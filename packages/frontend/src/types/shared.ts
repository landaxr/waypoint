export type Optional<T> = T | null;

export enum FileLocationKind {
  ipfs = "ipfs",
  https = "https",
  blob = "blob",
}

export type FileLocation =
  | {
      url: string;
      kind: FileLocationKind.ipfs | FileLocationKind.https;
    }
  | {
      kind: FileLocationKind.blob;
      file: File;
    };
