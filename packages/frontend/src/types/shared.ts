export type Optional<T> = T | null;

export enum FileLocationKind {
  ipfs = "ipfs",
  local = "local",
  ipfsLink = "ipfsLink",
  https = "https",
  blob = "blob",
}

export type FileLocation =
  | {
      url: string;
      kind: FileLocationKind.ipfs | FileLocationKind.https;
    }
  | {
      kind: FileLocationKind.local;
      path: string;
      fromIpfsLocation?: string;
    };
