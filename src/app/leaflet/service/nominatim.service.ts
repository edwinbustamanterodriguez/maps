import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {INominatim,} from "./nominatim.model";

@Injectable({
  providedIn: 'root',
})
export class NominatimService {
  public resourceUrl = 'https://nominatim.openstreetmap.org/reverse?format=json';

  constructor(protected http: HttpClient) {
  }

  findAddressByLatLon(latitude: string, longitude: string): Observable<HttpResponse<INominatim>> {
    return this.http.get<INominatim>(`${this.resourceUrl}&lat=${latitude}&lon=${longitude}`, {observe: 'response'});
  }
}
