export const generateSlug = (property) => {
   const slugParts = [];

  const formatText = (text) =>
    text?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  if (property.category === "Residential") {
    if (property.bhk) slugParts.push(formatText(property.bhk));

    // Prefer super area, fall back to carpet area
    if (property.superArea) {
      slugParts.push(`${property.superArea}-sqft`);
    } else if (property.carpetArea) {
      slugParts.push(`${property.carpetArea}-sqft`);
    }

    // slugParts.push("multistorey-apartment");

    if (property.purpose) {
      if (property.purpose.toLowerCase() === "rentsaleboth") {
        slugParts.push("for-rent-sale");
      } else {
        slugParts.push(`for-${formatText(property.purpose)}`);
      }
    }
  } else if (property.category === "Commercial") {
    if (property.propertyType) {
      slugParts.push(formatText(property.propertyType));
    }
    slugParts.push("commercial-property");
    if (property.purpose) {
      if (property.purpose.toLowerCase() === "rentsaleboth") {
        slugParts.push("for-rent-lease");
      } else {
        slugParts.push(`for-${formatText(property.purpose)}`);
      }
    }
  } else if (property.category === "Plot") {
    if (property.propertyType) {
      slugParts.push(formatText(property.propertyType));
    }
    slugParts.push("plot");
    if (property.purpose) {
      if (property.purpose.toLowerCase() === "rentsaleboth") {
        slugParts.push("for-rent-lease");
      } else {
        slugParts.push(`for-${formatText(property.purpose)}`);
      }
    }
  }

  // Common parts for all categories
  if (property.society) slugParts.push(formatText(property.society));
  if (property.locality) slugParts.push(formatText(property.locality));
  if (property.city) slugParts.push(formatText(property.city));
  if (property.state) slugParts.push(formatText(property.state));

  // Always end with ID to ensure uniqueness
  slugParts.push(property.id);

  return slugParts.filter(Boolean).join("-");
};
