import * as fs from "fs/promises";
import { AddAlbums } from "./albums";
import { AddArtists } from "./artists";
import { AddTracks } from "./tracks";

async function main() {
  try {
    const albums = await AddAlbums();
    const artists = await AddArtists();
    const tracks = await AddTracks();

    writeAssets("albums", albums);
    writeAssets("artists", artists);
    writeAssets("tracks", tracks);
  } catch (error) {
    console.log("Something went wrong!");
    console.log(error);
  }
}

async function directoryExists(path: string): Promise<boolean> {
  try {
    const stats = await fs.stat(path);
    return stats.isDirectory();
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return false;
    }
    throw err;
  }
}
async function writeAssets(asset: string, assets: any) {
  const dir = "./assets";

  if (!(await directoryExists(dir))) {
    await fs.mkdir(dir);
  }
  await fs.writeFile(`${dir}/${asset}.json`, JSON.stringify(assets, null, 2));
}

main();
