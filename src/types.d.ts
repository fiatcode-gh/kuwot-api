export interface AuthPayload {
  // An UUID string, unique per request.
  token: string;

  // Unix time in seconds. It is the time when the token was issued.
  // Will expire after a time window.
  issuedAt: number;
}

export interface Quote {
  id: number;
  text: string;
  author: string;
}

export interface Translation {
  id: number;
  lang: string;
  tableName: string;
}

export interface UnsplashImage {
  id: string;
  description: string;
  color: string;
  blurHash: string;
  url: string;
  originUrl: string;
  authorName: string;
  authorBio: string;
  authorLocation: string;
  authorTotalLikes: number;
  authorTotalPhotos: number;
  authorIsForHire: boolean;
  authorProfileImageUrl: string;
  authorUrl: string;
}
