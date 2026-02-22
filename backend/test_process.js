const processListing = (row) => {
  let image = row.image;
  let allImages = row.image ? [row.image] : [];

  if (row.image && row.image.startsWith("[")) {
    try {
      const parsed = JSON.parse(row.image);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Only get absolute path if it is relative
        image = parsed[0].startsWith("http")
          ? parsed[0]
          : `http://localhost:5000${parsed[0]}`;
        allImages = parsed.map((url) =>
          url.startsWith("http") ? url : `http://localhost:5000${url}`,
        );
      }
    } catch (e) {
      console.log("Error parsing row image", e);
    }
  } else if (image && !image.startsWith("http")) {
    image = `http://localhost:5000${image}`;
    allImages = [image];
  }
  return { ...row, image, allImages };
};

const row = {
  id: 20,
  image:
    '["/uploads/1771783632570-935004675.jpg","/uploads/1771783632593-844480740.jpg","/uploads/1771783632599-891643384.jpeg","/uploads/1771783632601-653486324.jpeg","/uploads/1771783632602-610992297.jpeg"]',
};

console.log(JSON.stringify(processListing(row), null, 2));
