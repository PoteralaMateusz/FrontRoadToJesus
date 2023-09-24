import {Component, OnInit} from '@angular/core';
import {ChurchService} from "../_services/church.service";
import {Church} from "../_model/church";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit{
churches : Church[] = [];
  constructor(private churchService:ChurchService) {
  }

  ngOnInit(): void {
    this.churchService.getAllChurches().subscribe( data => {
      this.churches = data;
      console.log(this.churches);
    });
  }


}
