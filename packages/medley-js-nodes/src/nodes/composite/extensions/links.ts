export const onLinksChange = Symbol("onLinksChange");

declare module "@medley-js/core" {
  interface Links {
    [onLinksChange]?: () => void;
  }  
}
