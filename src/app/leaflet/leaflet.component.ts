import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalMapComponent} from "./modal-map/modal-map.component";
import {icon, latLng, MapOptions, marker, tileLayer} from "leaflet";
import {faMapMarked} from "@fortawesome/free-solid-svg-icons";
import {FormBuilder, Validators} from "@angular/forms";
import {INominatim, Nominatim} from "./service/nominatim.model";

@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss']
})
export class LeafletComponent implements OnInit {

  options: MapOptions = {};
  inominatim: INominatim | undefined;


  faMapMarked = faMapMarked;

  editForm = this.fb.group({
    address: [null, [Validators.required]],
    latitude: [null, [Validators.required]],
    longitude: [null, [Validators.required]],
  });

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
  constructor(private modalService: NgbModal, protected fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.options = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> XIOBIT'
        }),
        marker([-17.3754111, -66.157283],
          {
            icon: icon({
              iconSize: [30, 50],
              iconAnchor: [13, 41],
              iconUrl: 'assets/marker-custom.png',
            })
          }).bindPopup('Aqui la direccion.<br> salto de linea').openPopup()
      ],
      zoom: 20,
      zoomControl: true,
      center: latLng(-17.3754111, -66.157283)
    };
  }

  openMapDialog(): void {
    const modalRef = this.modalService.open(ModalMapComponent, {
      size: 'xl',
      backdrop: 'static',
    });

    modalRef.componentInstance.inominatim = {
      ...new Nominatim(),
      lat: this.editForm.get(['latitude'])!.value,
      lon: this.editForm.get(['longitude'])!.value
    };
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      this.inominatim = reason;
      if(this.inominatim?.lat){

        const marker1 = marker([Number(this.inominatim?.lat),Number(this.inominatim?.lon)], {
          icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'assets/marker-custom.png',
          })
        });
        this.layers = [marker1];

        this.options = {
          zoom: 20,
          zoomControl: true,
          center: latLng(Number(this.inominatim?.lat),Number(this.inominatim?.lon))
        };

        this.editForm.patchValue({
          address: this.inominatim?.display_name,
          latitude: this.inominatim?.lat,
          longitude:this.inominatim?.lon
        });
      }

    });
  }
}
