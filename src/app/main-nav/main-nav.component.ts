import { Component, OnInit } from "@angular/core"
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout"
import { Observable } from "rxjs"
import { map, shareReplay } from "rxjs/operators"
import { LoginService } from "../service/login/login.service"
import { Iprivilage } from "src/app/pojo/privilage"
import { HttpClient } from "@angular/common/http"
import { Iloged } from "../pojo/loged"
import * as statics from "../global"
import { element } from "protractor"


@Component({
             selector: "app-main-nav",
             templateUrl: "./main-nav.component.html",
             styleUrls: ["./main-nav.component.css"]
           })
export class MainNavComponent {
  LOGO = require("../../assets/images/cat.png")
  private urlprivilage = statics.ip + "privilage"
  privilage: Iprivilage
  isLogin = true
  // tslint:disable-next-line:member-ordering
  privilages = []
  url = statics.ip
  name
  panelOpenState

  constructor(private breakpointObserver: BreakpointObserver, private login: LoginService, private http: HttpClient) {

  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay()
  )

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {

    this.getNames()
    //  this.privilages = JSON.parse(localStorage.getItem('privilage'));

    console.log("----------------------- privilages")

    let iduser = 0
    const arrr = JSON.parse(sessionStorage.getItem("loged"))

    if (arrr != null && arrr.length > 0) {
      iduser = arrr[0].idUser
    }

    this.http.post(this.urlprivilage, { id: iduser }).subscribe(data => {
      this.privilages = null
      this.privilages = JSON.parse(JSON.stringify(data))

      console.log(this.privilages)

      sessionStorage.setItem("privilage", JSON.stringify(this.privilages))

      if (this.privilages != null && this.privilages.length > 0) {
        this.isLogin = true

        this.privilages.forEach(el => {
          this.http.post(this.urlprivilage + "/sub", { id: iduser, main: el.id }).subscribe(da => {
            el.sub = JSON.parse(JSON.stringify(da))
          })
        })


      } else {

      }
    })

  }


  getUserType() {
    let type = sessionStorage.getItem("utype")
    if (type != null) {
      if (type == "1") {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  getNames() {
    this.http.post(this.url + "userlogin/keyval", { key: "name" }).subscribe(res => {
      this.name = res[0].value
    })
  }

  logOut() {
    this.login.logOut()
  }


}
