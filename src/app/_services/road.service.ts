import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Road} from "../_model/road";

const ROAD_API = "http://localhost:8080/road";

@Injectable({
  providedIn: 'root'
})
export class RoadService {

  constructor(private httpClient: HttpClient) {
  }
  getRoadsBetweenPointToChurches(longitude: number, latitude: number): Observable<Road[]> {
    return this.httpClient.get<Road[]>(`${ROAD_API}/point/${longitude}/${latitude}`);
  }
}
