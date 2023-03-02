import { SqueezeServer } from "squeezenode-ts/lib/SqueezeServer";
import { config } from "./config";

export interface AlbumHeader {
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

const catalogAlbums: AlbumHeader = {
  type: "AMAZON.MusicAlbum",
  version: "2.0",
  locales: [
    {
      country: "GB",
      language: "en",
    },
  ],
  entities: [],
};

export async function AddAlbums() {
  const squeezeServer = new SqueezeServer(config);

  const albums = await squeezeServer.getAlbums(40000);

  for (const album of albums) {
    const entity: Entity = {
      id: `album.${album.id.toString()}`,
      names: [
        {
          language: "en",
          value: album.album,
        },
      ],
      lastUpdatedTime: new Date(),
      popularity: {
        default: 100,
      },
    };

    catalogAlbums.entities.push(entity);
  }
  return catalogAlbums;
}
