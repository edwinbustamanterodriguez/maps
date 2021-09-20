import {IAddress} from "./address.model";

export interface INominatim {
  place_id?:number;
  address?: IAddress;
  display_name?: string;
  lat?: string;
  lon?: string;
  licence?: string;
}

export class Nominatim implements INominatim {
  constructor(
    public place_id?:number,
    public address?: IAddress,
    public display_name?: string,
    public lat?: string,
    public lon?: string,
    public licence?: string,
  ) {}
}


