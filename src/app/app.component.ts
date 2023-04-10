import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  public testValue: String = "press the button." ; 

  constructor(private userService:UserService) { }

  setTestValue(s : String) {
    this.testValue = s; 
  }

  performTest() {
    console.log("inside perform test"); 
    this.userService.getTestValue().subscribe((value:String) => {
      console.log("inside subscribe function"); 
      this.testValue = value as String; 
    }); 
  }
}
