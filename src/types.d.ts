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
