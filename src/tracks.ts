import { SqueezeServer } from "squeezenode-ts/lib/SqueezeServer";
import { config } from "./config";

export interface TrackHeader {
  type: string;
  version: string;
  locales: Locale[];
  entities: Entity[];
}

export interface Entity {
  id: string;
  names: Name[];
  popularity: Popularity;
  lastUpdatedTime: Date;
  locales?: Locale[];
  alternateNames?: AlternateName[];
  languageOfContent?: string[];
  Tracks?: Track[];
  deleted?: boolean;
  artists?: Album[];
  albums?: Album[];
}

export interface Album {
  id: string;
  names: Name[];
  alternateNames?: AlternateName[];
  releaseType?: string;
}

export interface AlternateName {
  language: string;
  values: string[];
}

export interface Track {
  id: string;
  names: Name[];
  alternateNames?: AlternateName[];
}

export interface Name {
  language: string;
  value: string;
}

export interface Locale {
  country: string;
  language: string;
}

export interface Popularity {
  default: number;
  overrides?: Override[];
}

export interface Override {
  locale: Locale;
  value: number;
}

const catalogTracks: TrackHeader = {
  type: "AMAZON.MusicRecording",
  version: "2.0",
  locales: [
    {
      country: "GB",
      language: "en",
    },
  ],
  entities: [],
};

export async function AddTracks() {
  const squeezeServer = new SqueezeServer(config);

  const tracks = await squeezeServer.getTrackInfo(0, 40000);

  for (const track of tracks) {
    const entity: Entity = {
      id: `track.${track.id.toString()}`,
      names: [
        {
          language: "en",
          value: track.title,
        },
      ],
      lastUpdatedTime: new Date(),
      popularity: {
        default: 100,
      },
      albums: [
        {
          id: `album.${track.album_id}`,
          names: [
            {
              value: track.album,
              language: "en",
            },
          ],
        },
      ],
      artists: [
        {
          id: `artist.${track.artist_id}`,
          names: [
            {
              value: track.trackartist ? track.trackartist : track.albumartist!,
              language: "en",
            },
          ],
        },
      ],
    };

    catalogTracks.entities.push(entity);
  }
  return catalogTracks;
}
