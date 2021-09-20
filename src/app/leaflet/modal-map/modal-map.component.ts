import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {icon, latLng, LeafletMouseEvent, MapOptions, marker, polygon, tileLayer} from "leaflet";
import {NominatimService} from "../service/nominatim.service";
import {HttpResponse} from "@angular/common/http";
import {INominatim, Nominatim} from "../service/nominatim.model";

@Component({
  selector: 'app-modal-map',
  templateUrl: './modal-map.component.html',
  styleUrls: ['./modal-map.component.scss']
})
export class ModalMapComponent implements OnInit {
  options: MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> XIOBIT'
      }),
    ],
    zoom: 20,
    zoomControl: true,
    center: latLng(-17.3754111, -66.157283)
  };

  inominatim: INominatim | undefined;

  layers = [
    marker([-17.3754111, -66.157283],
      {
        icon: icon({
          iconSize: [30, 50],
          iconAnchor: [13, 41],
          iconUrl: 'assets/marker-custom.png',
        })
      }).bindPopup('Aqui la direccion.<br> salto de linea').openPopup()
  ];


  constructor(public activeModal: NgbActiveModal, protected nominatimService: NominatimService) {
  }

  ngOnInit(): void {

    if (this.inominatim?.lat && this.inominatim.lon) {
      this.toAddress(this.inominatim.lat, this.inominatim.lon);
    }
  }

  cancel(): void {
    this.activeModal.close('close');
  }

  clickEvent(leafletMouseEvent: LeafletMouseEvent): void {

    const latlng = leafletMouseEvent.latlng;
    if (latlng) {
      const marker1 = marker([latlng.lat, latlng.lng], {
        icon: icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: 'assets/marker-custom.png',
        })
      });
      this.layers = [marker1];
      this.toAddress(`${leafletMouseEvent.latlng.lat}`, `${leafletMouseEvent.latlng.lng}`);
    }
  }

  toAddress(latitude: string, longitude: string): void {
    this.nominatimService.findAddressByLatLon(latitude, longitude).subscribe(
      (res: HttpResponse<INominatim>) => {
        const Inominatim = res.body;
        if (Inominatim?.display_name) {
          this.inominatim = Inominatim;
        } else {
          this.inominatim = {
            ...new Nominatim(),
            display_name: 'No se pudo geocodificar intente mas tarde',
            lat: `${latitude}`,
            lon: `${longitude}`
          };
        }
      },
      () => {
        this.inominatim = {
          ...new Nominatim(),
          display_name: 'No se pudo geocodificar intente mas tarde',
          lat: `${latitude}`,
          lon: `${longitude}`
        };
      }
    );
  }

  save(): void {
    this.activeModal.close(this.inominatim);
  }
}
