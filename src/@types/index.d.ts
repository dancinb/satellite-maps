// https://stackoverflow.com/questions/51100401/typescript-image-import
declare module '*.png'
declare module '*.svg'

declare module '@vue-leaflet/vue-leaflet' {
  import type { DefineComponent } from 'vue';
  export const LMap: DefineComponent;
  export const LIcon: DefineComponent;
  export const LTileLayer: DefineComponent;
  export const LMarker: DefineComponent;
  export const LCircle: DefineComponent;
  export const LControlLayers: DefineComponent;
  export const LControlZoom: DefineComponent;
  export const LControlAttribution: DefineComponent;
  export const LTooltip: DefineComponent;
  export const LPopup: DefineComponent;
  export const LPolyline: DefineComponent;
  export const LPolygon: DefineComponent;
  export const LRectangle: DefineComponent;
}