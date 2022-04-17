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
        <l-control-attribution
          position="topleft"
          :prefix="status"
        ></l-control-attribution>
        <l-control-zoom position="bottomright"></l-control-zoom>
        <l-marker :lat-lng="center">
          <l-icon :icon-url="iconUrl" :icon-size="[40, 40]"> </l-icon>
          <l-popup>
            中国空间站天和核心舱
            <hr />
            海拔：{{ height }} km<br />
            速度：{{ velocity }} km/s<br />
            位置：{{ lat }}&deg; N {{ lng }}&deg; E
          </l-popup>
        </l-marker>
        <l-polyline :lat-lngs="tracks"></l-polyline>
        <l-circle
          :lat-lng="center"
          :radius="1000000"
          :color="'#c22'"
          :opacity="3"
          :weight="1"
        />
        <l-circle
          :lat-lng="center"
          :radius="600000"
          :color="'#c22'"
          :opacity="3"
          :weight="1"
        />
        <l-circle
          :lat-lng="center"
          :radius="300000"
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
  getSatelliteName,
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
      satName: '',
      satInfo: {} as SatelliteInfoOutput,
      satMarker: null,
      TLEUrl: 'https://celestrak.com/NORAD/elements/gp.php?INTDES=2021-035&FORMAT=TLE',
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
        '<a href="https://github.com/openbunny/satellite-maps" target="_blank">GitHub</a> | 基础地图来自 OpenStreetMap'
    }
  },
  computed: {
    height(): number {
      return Number(Number(this.satInfo.height).toFixed(2)) || 0
    },
    velocity(): number {
      return Number(Number(this.satInfo.velocity).toFixed(2)) || 0
    },
    lat(): number {
      return Number(Number(this.satInfo.lat).toFixed(2)) || 0
    },
    lng(): number {
      return Number(Number(this.satInfo.lng).toFixed(2)) || 0
    },
    center(): [number, number] {
      return [this.lat, this.lng]
    },
    status(): string {
      return `${this.satName} | 海拔: ${this.height} km 速度: ${this.velocity} km/s 位置: ${this.lat}&deg; N ${this.lng}&deg; E`
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
      // 测试数据
      this.tle = parseTLE(resp.data.split('\n').slice(0,3))
      this.satName = getSatelliteName(this.tle)
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