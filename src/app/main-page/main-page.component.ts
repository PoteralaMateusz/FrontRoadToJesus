import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ChurchService} from "../_services/church.service";
import {Church} from "../_model/church";
import * as L from 'leaflet';


const customIcon = L.icon({
  iconUrl: 'assets/church.png',
  iconSize: [20, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements AfterViewInit, OnInit {
  churches: Church[] = [];
  private map: any;

  constructor(private churchService: ChurchService) {
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

  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnInit(): void {

    this.churchService.getAllChurches().subscribe(data => {
      this.churches = data;
      this.churches.forEach((church) => {
        const marker = L.marker([church.latitude, church.longitude], {icon: customIcon}).addTo(this.map);
        marker.bindPopup(`
        <strong>${church.name}</strong><br>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${church.latitude},${church.longitude}" target="_blank">
          Nawiguj do tego miejsca
        </a>
      `, {closeOnClick: false, autoClose: false});
        marker.openPopup();
      });


    });
  }


}
