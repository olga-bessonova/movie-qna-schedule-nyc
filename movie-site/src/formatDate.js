export default function formatDate(dateSpring) {
    const date = new Date(dateSpring);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }