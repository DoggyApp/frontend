import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private userService:UserService) { }

  ngOnInit(): void {
  }

  title = 'frontend';

  public testValue: String = "press the button." ; 
  public errorTestValue: String = "trigger frontend error" ;
  public backendErrorTestValue: String = "trigger backend error" ;

  setTestValue(s : String) {
    this.testValue = s; 
  }

  setErrorTestValue(s : String) {
    this.errorTestValue = s; 
  }

  setBackendErrorTestValue(s : String) {
    this.backendErrorTestValue = s; 
  }

  performTest() {
    console.log("inside perform test"); 
    this.userService.getTestValue().subscribe((value:String) => {
      console.log("inside subscribe function"); 
      this.testValue = value as String; 
    }); 
  }

  triggerError() {
    this.setErrorTestValue("check your email"); 
    throw new Error('Someone clicked the botton!');
  }

  triggerBackendError() {
    console.log("inside backend error perform test"); 
    this.userService.getBackendErrorTestValue().subscribe((value:String) => {
      console.log("inside subscribe function"); 
    }); 
  }

}
