import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ICON } from './../const/icon.const'
import { PRICERANGERS } from './../const/priceRangers.const'
import { BehaviorSubject, Observable, Subject, takeUntil, pipe, take, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  public icons = ICON;
  public priceRangers = PRICERANGERS;
  public image: any;
  public products: any = [];
  public arrayWithProducts: any = [];
  public capmaignNames: any = [];
  public filterProducts: any = [];
  private url = "https://apigw.mweb.co.za/prod/baas/proxy/marketing/products/promos/FTTH-OPEN-SETUP-CLAWBACK-100MBUP-NEW,FTTH-VUMA-CLAWBACK-50DEAL,FTTH-EVOTEL-CLAWBACK-100MBUP,FTTH-FROG-CLAWBACK-50DEAL,FTTH-LINKLAYER-CLAWBACK-100MBUP,FTTH-VODA-CLAWBACK-100MBUP,FTTH-TTCONNECT-CLAWBACK-100MBUP,FTTH-CLEARACCESS-CLAWBACK,FTTH-ZOOM-CLAWBACK,FTTH-OCTOTEL-SETUP-100MBUP,FTTH-CCC-CLARA-CLAWBACK,FTTH-CCC-SETUP-100MBUP,FTTH-CCC-ALT-SETUP-100MBUP,FTTH-VUMA-CLAWBACK-100MBUP,FTTH-WEBCONNECT-M2M,FTTH-LINKAFRICA-SETUP-CLAWBACK-100MBUP,FTTH-MFN-SETUP-CLAWBACK-50DEAL,FTTH-FROG-M2M-SETUP-CLAWBACK-100MBUP,FTTH-LIGHTSTRUCK-SETUP-CLAWBACK-100MBUP,FTTH-FROGFOOTAIR-M2M?sellable_online=true"
  private campaignsURL: string = "https://apigw.mweb.co.za/prod/baas/proxy/marketing/campaigns/fibre?channels=120&visibility=public";
  private promoWithProducts: any = [];
  private allPromocodes: any = [];


  constructor(private cdr: ChangeDetectorRef) { }
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  ngOnInit(): void {
    this.getCapmaignNames()
    this.getPromoWithProducts();

  }

  public getImage(val: string) {
    this.icons.filter((el: any) => {
      if (val.includes(el.name)) {
        this.image = el.url;
      }
    })
    return true;
  }

  public filterCampaign(val: any): void {
    this.arrayWithProducts = [];
    val.promocodes.map((key: any) => this.allPromocodes.push(key));
    for (let i = 0; i < this.allPromocodes.length; i++) {
      let promocode = this.allPromocodes[i]
      for (let k = 0; k < this.promoWithProducts.length; k++) {
        let promocodeWithProducts = this.promoWithProducts[k]
        if (promocode === promocodeWithProducts.promoCode) {
          promocodeWithProducts.products.map((el: any) => {
            this.arrayWithProducts.push(el);
          })
        }
      }
    }
    this.allPromocodes = [];
  }

  public selectProvider(icon: any) {
    this.products = this.arrayWithProducts.filter((prod: any) => prod.subcategory.includes(icon.name));
  }

  public choosePrice(price: any): void {
    if(this.products.length === 0){
      this.filterProducts = this.arrayWithProducts.filter((prod: any) => prod.productRate > price.min && prod.productRate <= price.max);
    }
    else{
      this.filterProducts = this.products.filter((prod: any) => prod.productRate > price.min && prod.productRate <= price.max);
    }

  }

  private getCapmaignNames() {
    return fetch(this.campaignsURL)
      .then((response) => response.json())
      .then((data) => data.campaigns)
      .then((selectedCampaign) => {
        selectedCampaign.map((data: any) => {
          this.capmaignNames.push(data);
        })
      })
  }

  private getPromoWithProducts() {
    return fetch(this.url)
      .then(response => response.json())
      .then(data => data.map((el: any) => {
        this.promoWithProducts.push(el);
      }))
  }
}