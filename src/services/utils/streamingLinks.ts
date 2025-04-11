
// Generate streaming links from recording data
export const generateStreamingLinks = (recording: any) => {
  const title = recording.title || '';
  const artist = recording.artists ? recording.artists[0].name : '';
  const searchTerm = encodeURIComponent(`${title} ${artist}`.trim());
  
  return {
    spotify: `https://open.spotify.com/search/${searchTerm}`,
    apple: `https://music.apple.com/search?term=${searchTerm}`,
    youtube: `https://www.youtube.com/results?search_query=${searchTerm}`
  };
};

// Generate streaming links from title and artist directly
export const generateStreamingLinksFromNames = (title: string, artist: string) => {
  const searchTerm = encodeURIComponent(`${title} ${artist}`.trim());
  
  return {
    spotify: `https://open.spotify.com/search/${searchTerm}`,
    apple: `https://music.apple.com/search?term=${searchTerm}`,
    youtube: `https://www.youtube.com/results?search_query=${searchTerm}`
  };
};
