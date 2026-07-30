const SUPABASE_PUBLIC_BUCKET =
  "https://vcznwmkvphvkpkucciyw.supabase.co/storage/v1/object/public/xaluca";

export const supabaseMedia = (path) =>
  `${SUPABASE_PUBLIC_BUCKET}/${String(path || "")
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")}`;
