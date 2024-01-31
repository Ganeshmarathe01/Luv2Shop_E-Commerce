import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State } from '../common/state';
import { map, Observable,of } from 'rxjs';
import { Country } from '../common/country';

@Injectable({
  providedIn: 'root'
})
export class Luv2shopformserviceService {

  private countriesUrl='http://localhost:8080/api/countries';
  private statesUrl='http://localhost:8080/api/states/'; 

  constructor(private httpClient:HttpClient) { }

  //method to return the months 
  getCreditCardMonths(startMonth : number):Observable<number[]>{
    let data:number[]=[];
    
    for(let theMonth = startMonth ; theMonth <=12 ; theMonth++){
      data.push(theMonth);
    }

    return of(data);
  }

  //method to current + 10 years 
  getCreditCardYears() :Observable<number[]>{
    let data:number[]=[];

    let startYear = new Date().getFullYear();
    let endYear = startYear + 10;

    for(let theYear = startYear ; theYear <=endYear ; theYear++){
      data.push(theYear);
    }

    return of(data);
  }

  //method to fetch countries from API side 
  getCountries(): Observable<Country[]>{
    return this.httpClient.get<GetResponseCountry>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  //method to fetch states based on passed country-code from API side 
  getStates(code:string): Observable<State[]>{
    return this.httpClient.get<GetResponseState>(`${this.statesUrl}search/findByCountryCode?code=${code}`).pipe(
      map(response =>response._embedded.states)
    );
  }

}

interface GetResponseCountry {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseState {
  _embedded: {
    states: State[];
  }
}
