import type { UnsplashImage } from '../types';

async function listRandomImages(count: number = 10): Promise<UnsplashImage[]> {
  const headers = {
    Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
    'Accept-Version': 'v1',
  };
  const response = await fetch(
    `https://api.unsplash.com/photos/random?count=${count}`,
    { headers }
  );
  const data = await response.json();
  const images: UnsplashImage[] = Array.isArray(data)
    ? data.map((img: any) => ({
        id: img.id,
        description: img.alt_description ?? 'No description',
        color: img.color,
        blurHash: img.blur_hash,
        url: img.urls.regular,
        originUrl: buildUtmUrl(img.links.html),
        authorName: img.user.name,
        authorBio: img.user.bio ?? 'No bio',
        authorLocation: img.user.location,
        authorTotalLikes: img.user.total_likes,
        authorTotalPhotos: img.user.total_photos,
        authorIsForHire: img.user.for_hire,
        authorProfileImageUrl: img.user.profile_image.large,
        authorUrl: buildUtmUrl(img.user.links.html),
      }))
    : [];
  return images;
}

function buildUtmUrl(url: string): string {
  return `${url}?utm_source=kuwot-api&utm_medium=referral`;
}

export { listRandomImages };
