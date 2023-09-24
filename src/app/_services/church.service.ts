import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Church} from "../_model/church";

const CHURCH_API = "http://localhost:8080/churches";

@Injectable({
  providedIn: 'root'
})
export class ChurchService {

  constructor(private httpClient: HttpClient) {
  }

  getAllChurches():Observable<Church[]>{
    return this.httpClient.get<Church[]>(`${CHURCH_API}/all`);
  }
}
