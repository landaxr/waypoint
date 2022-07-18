export type Optional<T> = T | null;

export enum FileLocationKind {
  ipfs = "ipfs",
  https = "https",
  temporary = "temporary",
}

export type FileLocation = {
  url: string;
  kind: FileLocationKind;
};
