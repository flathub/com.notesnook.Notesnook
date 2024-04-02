// flatpak-builder is excrutiatingly slow when downloading sources. This
// script converts the sources to aria2c compatible format to allow
// faster & parallel downloading.
// !! This is only used during testing.!!

const fs = require("fs");
const { join, basename } = require("path");

const json = JSON.parse(fs.readFileSync("generated-sources.json", "utf-8"));

let list = [];
for (const source of json) {
  if (source.type !== "file" || !source.url || !source.sha512) continue;
  let out = join(
    ".flatpak-builder",
    "downloads",
    source.sha512,
    basename(source.url)
  );
  list.push(`${source.url}\n\tout=${out}\n\tchecksum=sha-512=${source.sha512}`);
}

fs.writeFileSync("list.txt", list.join("\n"));

// To download run:
// aria2c -i list.txt -j8
