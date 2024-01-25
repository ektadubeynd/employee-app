import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  
  setData(key: string, value: object) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getData(key: string ) {
    return localStorage.getItem(key);
  }

  removeData() {
    localStorage.removeItem("employeeList");
  }
}
