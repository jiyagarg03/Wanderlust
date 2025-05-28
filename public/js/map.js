const locationName = window.locationName; // set earlier in EJS

fetch(
  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    locationName
  )}`
)
  .then((res) => res.json())
  .then((data) => {
    if (data && data.length > 0) {
      const lon = parseFloat(data[0].lon);
      const lat = parseFloat(data[0].lat);

      const map = new maplibregl.Map({
        container: "map",
        center: [lon, lat],
        zoom: 10,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
          },
          layers: [
            {
              id: "osm-layer",
              type: "raster",
              source: "osm",
            },
          ],
        },
      });

      new maplibregl.Marker({ color: "red" }) // you can use 'red', '#ff69b4', etc.
        .setLngLat([lon, lat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(
            `<h6>${locationUsed}</h6><p>Exact Location will be provided after booking</p>`
          )
        )
        .addTo(map);
    } else {
      console.error("Location not found");
    }
  })
  .catch((err) => {
    console.error("Geocoding error:", err);
  });
