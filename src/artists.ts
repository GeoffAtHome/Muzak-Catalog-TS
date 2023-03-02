import { SqueezeServer } from "squeezenode-ts/lib/SqueezeServer";
import { config } from "./config";

export interface ArtistHeader {
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
  artists?: Artist[];
  deleted?: boolean;
}

export interface AlternateName {
  language: string;
  values: string[];
}

export interface Artist {
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

const catalogArtists: ArtistHeader = {
  type: "AMAZON.MusicGroup",
  version: "2.0",
  locales: [
    {
      country: "GB",
      language: "en",
    },
  ],
  entities: [],
};

export async function AddArtists() {
  const squeezeServer = new SqueezeServer(config);

  const Artists = await squeezeServer.getArtists(40000);

  for (const artist of Artists) {
    const entity: Entity = {
      id: `artist.${artist.id.toString()}`,
      names: [
        {
          language: "en",
          value: artist.artist,
        },
      ],
      lastUpdatedTime: new Date(),
      popularity: {
        default: 100,
      },
    };

    catalogArtists.entities.push(entity);
  }
  return catalogArtists;
}
