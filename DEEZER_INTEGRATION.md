# Deezer API Integration

This music player now includes integration with the Deezer API via RapidAPI, allowing you to search and stream millions of songs including Hindi/Bollywood music.

## Features

- **Search Music**: Search for any song, artist, or album
- **Top Charts**: Browse the latest trending songs
- **Hindi/Bollywood Section**: Dedicated section for Indian music
- **Quick Searches**: Pre-configured quick search buttons for popular genres and artists
- **30-second Previews**: Stream 30-second previews of any track
- **High-Quality Album Art**: Display beautiful album covers

## Setup

### 1. Get a RapidAPI Key

1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to the [Deezer API](https://rapidapi.com/deezerdevs/api/deezer-1)
3. Copy your API key from the dashboard

### 2. Configure the API Key

The API key can be configured in two ways:

#### Option 1: Environment Variable (Recommended)
Update the `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
```

#### Option 2: Direct Configuration
Edit `/src/services/deezerApi.js` and update the API key:

```javascript
const RAPIDAPI_KEY = 'your_rapidapi_key_here';
```

### 3. Restart the Development Server

```bash
npm run dev
```

## Usage

### Accessing Deezer Music

1. Click on **"Deezer Music"** in the sidebar (orange music icon)
2. You'll see three tabs:
   - **Top Charts**: Latest trending songs
   - **Hindi/Bollywood**: Indian music collection
   - **Search Results**: Your custom searches

### Searching for Music

1. Use the search bar at the top
2. Enter song name, artist, album, or any search term
3. Click "Search" or press Enter
4. Results will appear as playable tracks

### Quick Searches

Pre-configured quick search buttons include:
- Bollywood Hits
- Arijit Singh
- AR Rahman
- Shreya Ghoshal
- Electronic
- Rock
- Jazz
- Pop

Click any button to instantly search for that genre/artist.

### Hindi/Bollywood Music

1. Click the **"Hindi/Bollywood"** tab
2. Browse through popular Hindi songs
3. Click on any track to play the 30-second preview

## API Functions

The Deezer API service (`/src/services/deezerApi.js`) provides these functions:

### Search Functions
- `searchTracks(query, limit)` - Search for any music
- `searchHindiSongs(limit)` - Get Hindi/Bollywood songs
- `searchByArtist(artistName, limit)` - Search by artist name

### Browse Functions
- `getCharts()` - Get top charts
- `getGenres()` - Get available genres
- `getRadioByGenre(genreId)` - Get radio tracks by genre

### Detail Functions
- `getTrack(trackId)` - Get specific track details
- `getArtist(artistId)` - Get artist information
- `getArtistTopTracks(artistId, limit)` - Get artist's top tracks
- `getAlbum(albumId)` - Get album with all tracks
- `getPlaylist(playlistId)` - Get playlist with tracks

## Track Data Structure

Each track returned from the API includes:

```javascript
{
  id: number,
  title: string,
  artist: string,
  artistId: number,
  album: string,
  albumId: number,
  cover: string,           // High-resolution cover image URL
  audio: string,           // 30-second preview URL
  duration: number,        // Duration in seconds
  link: string            // Link to full track on Deezer
}
```

## Limitations

### API Limitations
- **Preview Duration**: Only 30-second previews are available through the API
- **Rate Limits**: RapidAPI free tier has request limits (check your plan)
- **Geographic Restrictions**: Some content may be region-locked

### Current Implementation
- Tracks play 30-second previews only
- Full track streaming requires Deezer Premium integration
- Search results limited to 50 tracks per query (configurable)

## Troubleshooting

### "Access denied" Error

This usually means:
1. **Invalid API Key**: Check if your RapidAPI key is correct
2. **Subscription Expired**: Verify your RapidAPI subscription status
3. **Rate Limit Exceeded**: You may have exceeded your plan's request limit

**Solution**:
- Verify API key in `.env.local`
- Check your RapidAPI dashboard for subscription status
- Wait if rate limited, or upgrade your plan

### "No results found"

This can happen when:
1. The search query doesn't match any tracks
2. The API is temporarily unavailable
3. Region restrictions apply

**Solution**:
- Try different search terms
- Use quick search buttons
- Check the Deezer website to verify content availability

### Tracks not playing

Possible causes:
1. **CORS Issues**: Browser blocking cross-origin requests
2. **Network Issues**: Check your internet connection
3. **Preview Unavailable**: Some tracks may not have previews

**Solution**:
- Check browser console for errors
- Try a different track
- Ensure preview URLs are accessible

## Example API Calls

### Search for Hindi Songs
```javascript
import { searchHindiSongs } from '@/services/deezerApi';

const result = await searchHindiSongs(25);
if (result.success) {
  console.log('Found tracks:', result.tracks);
}
```

### Search by Artist
```javascript
import { searchByArtist } from '@/services/deezerApi';

const result = await searchByArtist('Arijit Singh', 20);
if (result.success) {
  console.log('Artist tracks:', result.tracks);
}
```

### Get Top Charts
```javascript
import { getCharts } from '@/services/deezerApi';

const result = await getCharts();
if (result.success) {
  console.log('Chart tracks:', result.tracks);
  console.log('Chart albums:', result.albums);
  console.log('Chart artists:', result.artists);
}
```

## Hindi/Bollywood Music Support

Yes! The API fully supports Hindi and Bollywood music. You can:

1. **Use the Hindi Tab**: Click "Hindi/Bollywood" to browse popular tracks
2. **Search by Hindi Artists**: Try "Arijit Singh", "Shreya Ghoshal", "AR Rahman", etc.
3. **Search by Movie**: Try "Kabir Singh songs", "Dilwale Dulhania Le Jayenge songs"
4. **Search by Genre**: Try "bollywood", "hindi romantic", "bollywood dance"

### Popular Hindi Search Queries
- "bollywood hits 2024"
- "arijit singh romantic"
- "ar rahman tamil"
- "shreya ghoshal melody"
- "badshah rap"
- "punjabi songs"
- "hindi sad songs"

## Technical Details

### File Structure
```
src/
├── services/
│   └── deezerApi.js           # Deezer API service
├── components/
│   └── DeezerBrowser.jsx      # Deezer browser component
└── app/
    └── page.jsx               # Main app with Deezer integration
```

### Dependencies
- **Howler.js**: For audio playback
- **Fetch API**: For API requests
- **React**: UI components

### Environment Variables
- `NEXT_PUBLIC_RAPIDAPI_KEY`: Your RapidAPI key

## Future Enhancements

Potential features for future updates:
- [ ] Full-length track streaming (requires Deezer SDK)
- [ ] Offline caching of previews
- [ ] Playlist creation from Deezer tracks
- [ ] User authentication with Deezer
- [ ] Lyrics integration
- [ ] Social sharing features
- [ ] Advanced filters (by year, mood, etc.)
- [ ] Recommendations based on listening history

## Support

For issues or questions:
1. Check the [Deezer API Documentation](https://developers.deezer.com/api)
2. Visit [RapidAPI Support](https://rapidapi.com/support)
3. Review browser console for error messages

## License

This integration uses the Deezer API through RapidAPI. Make sure to comply with:
- [Deezer Terms of Service](https://www.deezer.com/legal/cgu)
- [RapidAPI Terms](https://rapidapi.com/terms)
- Respect rate limits and usage restrictions
