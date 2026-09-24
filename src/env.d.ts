interface ImportMetaEnv {
  /** "true" opens indexing (M3 Public MVP). Unset / anything else = pre-launch: every page noindex, nofollow. */
  readonly PUBLIC_SITE_INDEXABLE?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
