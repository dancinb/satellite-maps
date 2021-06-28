<template>
  <div class="map-container">
    <div id="map-container">
      <l-map
        :center="center"
        :minZoom="2"
        :maxBounds="[
          [90, -180e2],
          [-90, 180e2]
        ]"
        :zoom="zoom"
        :zoomAnimation="true"
        :options="{ zoomControl: false, attributionControl: false }"
      >
        <l-control-layers position="topright"></l-control-layers>
        <l-tile-layer
          v-for="tileProvider in tileProviders"
          :key="tileProvider.name"
          :name="tileProvider.name"
          :visible="tileProvider.visible"
          :url="tileProvider.url"
          layer-type="base"
        ></l-tile-layer>
        <l-control-attribution
          position="bottomleft"
          :prefix="attributionPrefix"
        ></l-control-attribution>
        <l-control-zoom position="bottomright"></l-control-zoom>
        <l-marker :lat-lng="center">
          <l-icon :icon-url="iconUrl" :icon-size="[40, 40]"> </l-icon>
          <l-popup>
            中国空间站天和核心舱
            <hr />
            高度：{{ height.toFixed(2) }} km<br />
            速度：{{ velocity.toFixed(2) }} km/s<br />
            位置：{{ lat.toFixed(2) }}&deg; N {{ lng.toFixed(2) }}&deg; E
          </l-popup>
        </l-marker>
        <l-polyline :lat-lngs="tracks"></l-polyline>
        <l-circle
          :lat-lng="center"
          :radius="1000e3"
          :color="'#c22'"
          :opacity="3"
          :weight="1"
        />
        <l-circle
          :lat-lng="center"
          :radius="600e3"
          :color="'#c22'"
          :opacity="3"
          :weight="1"
        />
        <l-circle
          :lat-lng="center"
          :radius="200e3"
          :color="'#c22'"
          :opacity="3"
          :weight="1"
        />
      </l-map>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'
import {
  getGroundTracks,
  getSatelliteInfo,
  parseTLE,
  SatelliteInfoOutput,
  ThreeGroundTracks,
  TLE
} from 'tle.js'
import 'leaflet/dist/leaflet.css'
import { Map as LeafletMap } from 'leaflet'
import {
  LMap,
  LTileLayer,
  LControlZoom,
  LControlLayers,
  LControlAttribution,
  LMarker,
  LIcon,
  LPopup,
  LPolyline,
  LCircle
} from '@vue-leaflet/vue-leaflet'
import satelliteSVG from '@/assets/satellite.svg'

export default defineComponent({
  name: 'Map',
  components: {
    LMap,
    LTileLayer,
    LControlZoom,
    LControlLayers,
    LControlAttribution,
    LMarker,
    LIcon,
    LPopup,
    LPolyline,
    LCircle
  },
  data() {
    return {
      // 数据
      map: {} as LeafletMap,
      tle: {} as TLE,
      tracks: [[], [], []] as ThreeGroundTracks,
      satInfo: {} as SatelliteInfoOutput,
      satMarker: null,
      TLEUrl: 'https://www.positiveoutlook.cn/satcat/tle/48274',
      OSMUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      iconUrl: satelliteSVG,

      // Vue Leaflet 配置
      zoom: 5,
      tileProviders: [
        {
          name: 'OpenStreetMap',
          visible: true,
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        },
        {
          name: 'OpenTopoMap',
          visible: false,
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
        }
      ],
      attributionPrefix:
        '<a href="./about">关于此应用</a> | 基础地图和数据来自 OpenStreetMap'
    }
  },
  computed: {
    height(): number {
      return this.satInfo.height || 0
    },
    velocity(): number {
      return this.satInfo.velocity || 0
    },
    lat(): number {
      return this.satInfo.lat || 0
    },
    lng(): number {
      return this.satInfo.lng || 0
    },
    center(): [number, number] {
      return [this.lat, this.lng]
    }
  },
  watch: {
    // 侦听 TLE 数据变化，算出轨迹
    tle(data) {
      getGroundTracks({
        tle: data,
        isLngLatFormat: false
      }).then((data) => (this.tracks = data))
    }
  },
  mounted() {
    // 获取 TLE
    axios.get(this.TLEUrl).then((resp) => {
      this.tle = parseTLE(resp.data.tle)
      this.satInfo = getSatelliteInfo(this.tle, Date.now())
    })

    this.$nextTick(() => {
      // 每秒计算卫星数据
      setInterval(() => {
        this.satInfo = getSatelliteInfo(this.tle, Date.now())
      }, 1000)
    })
  }
})
</script>

<style lang="scss">
.map-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
#map-container {
  width: 100%;
  height: 100%;
}
</style>