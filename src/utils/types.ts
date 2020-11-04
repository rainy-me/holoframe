export type Stream = {
  members: {
    id?: string | number;
    name: string;
    avatar?: string;
    color?: string;
  }[];
  id: string;
  url: string;
  thumbnail: string;
  startTime: number;
  endTime?: number;
  isStreaming?: boolean;
  title?: string;
  description?: string;
  producer: "Hololive" | "にじさんじ";
} & {
  length?: string;
};

export type StreamItem = {
  id: string;
  muted: boolean;
};
