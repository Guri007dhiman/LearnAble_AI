const PEXELS_API_KEY = 'RIHstBkhhVYBOQj8IRhYJZOWZxYbl3SHCqSDhwIYXHucuImfJ8UEFmFn';

export interface PexelsImage {
  id: number;
  url: string;
  photographer: string;
  src: {
    medium: string;
    large: string;
    small: string;
  };
  alt: string;
}

export const searchImages = async (query: string, perPage: number = 5): Promise<PexelsImage[]> => {
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`, {
      headers: {
        'Authorization': PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch images from Pexels');
    }

    const data = await response.json();
    return data.photos || [];
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};