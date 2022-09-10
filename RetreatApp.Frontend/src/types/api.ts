export type CompareResponse = {
  originalContent: string;
  copyContent: string;
  diffs: {
    original: string;
    copy: string;
    lineNumber: number;
  }[];
};
