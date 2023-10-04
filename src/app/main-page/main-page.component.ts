import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ChurchService} from "../_services/church.service";
import {Church} from "../_model/church";
import * as L from 'leaflet';
import {LeafletMouseEvent} from 'leaflet';
import * as GeoSearch from 'leaflet-geosearch';
import {RoadService} from "../_services/road.service";
import {Road} from "../_model/road";


const churchIcon = L.icon({
  iconUrl: 'assets/church.png',
  iconSize: [20, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

const pinIcon = L.icon({
  iconUrl: 'assets/pin.png',
  iconSize: [45, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

const provider = new GeoSearch.OpenStreetMapProvider({
  params: {
    countrycodes: "pl"
  }
});

const userLocationMarker = L.marker([0, 0], {icon: pinIcon});

const churchMarkersLayer = L.layerGroup();
const roadMarkersLayer = L.layerGroup();

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements AfterViewInit, OnInit {
  churches: Church[] = [];
  roads: Road[] = [];
  private map: any;

  constructor(private churchService: ChurchService, private roadService: RoadService) {
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.addSearchBarToMap();
    this.setUserLocationMarkerAndAddRoadsBetweenThisPointToChurchAfterRightMouseClickOnMap();
  }

  ngOnInit(): void {
    this.getAllChurchesFromService();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [53.23644681895198, 20.177615235605057],
      zoom: 6
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
    churchMarkersLayer.addTo(this.map);
    roadMarkersLayer.addTo(this.map);
  }

  private addSearchBarToMap() {
    const searchControl = GeoSearch.GeoSearchControl({
      notFoundMessage: 'Sorry, that address could not be found.',
      style: 'bar',
      provider: provider,
      showMarker: true,
      marker: {icon: pinIcon,}
    });
    this.map.addControl(searchControl);
    this.clearMarkersSetUserLocationMarkerAddRoadsBetweenThisPointToChurchesAfterEnterAddressInSearchBar();
  }

  private clearMarkersSetUserLocationMarkerAddRoadsBetweenThisPointToChurchesAfterEnterAddressInSearchBar(){
    this.map.on('geosearch/showlocation', () => {
      churchMarkersLayer.clearLayers();
      roadMarkersLayer.clearLayers();
      this.map.removeLayer(userLocationMarker);
      this.map.eachLayer((item: any) => {
        if (item instanceof L.Marker) {
          userLocationMarker.setLatLng(item.getLatLng()).addTo(this.map);
          this.getRoadsBetweenPointToChurches(userLocationMarker.getLatLng().lng, userLocationMarker.getLatLng().lat);
          this.map.removeLayer(item);
        }
      });
      this.map.setView(userLocationMarker.getLatLng(),12);
    });
  }

  private setUserLocationMarkerAndAddRoadsBetweenThisPointToChurchAfterRightMouseClickOnMap() {
    this.map.on('contextmenu', (e: LeafletMouseEvent) => {
      const latlng = e.latlng;
      churchMarkersLayer.clearLayers();
      userLocationMarker.setLatLng(latlng).addTo(this.map);
      this.map.setView(latlng, 12);
      this.getRoadsBetweenPointToChurches(userLocationMarker.getLatLng().lng,userLocationMarker.getLatLng().lat);
    });
  }

  private getAllChurchesFromService() {
    this.churchService.getAllChurches().subscribe(data => {
      this.churches = data;
      this.addChurchesMarkersToMap();
    });
  }

  private getRoadsBetweenPointToChurches(longitude: number, latitude: number) {
    this.roadService.getRoadsBetweenPointToChurches(longitude, latitude).subscribe(data => {
      this.roads = data;
      this.addRoadsMarkersToMap();
    })
  }

  private addRoadsMarkersToMap() {
    roadMarkersLayer.clearLayers();
    this.roads.forEach((road) => {
      this.churchService.getChurchByID(road.destinationChurchID).subscribe(church => {
        const marker = L.marker([church.latitude, church.longitude], {icon: churchIcon}).addTo(roadMarkersLayer);
        marker.bindPopup(`
        <strong>${church.name}</strong><br>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${church.latitude},${church.longitude}" target="_blank">
          Nawiguj do tego miejsca
        </a>
        <strong>Distance ${road.distance}</strong>
      `, {closeOnClick: false, autoClose: false}).openPopup();
      });
    });
  }

  private addChurchesMarkersToMap() {
    this.churches.forEach((church) => {
      const marker = L.marker([church.latitude, church.longitude], {icon: churchIcon}).addTo(churchMarkersLayer);
      marker.bindPopup(`
        <strong>${church.name}</strong><br>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${church.latitude},${church.longitude}" target="_blank">
          Nawiguj do tego miejsca
        </a>
      `, {closeOnClick: false, autoClose: false});
    });
  }

}
