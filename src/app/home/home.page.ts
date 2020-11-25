import { Component, OnInit } from '@angular/core';
import {LaunchpadService} from '../services/launchpad.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private launchpad: LaunchpadService) {}

  ngOnInit() {
  }

}
