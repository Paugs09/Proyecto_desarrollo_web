import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Adventure } from '../interfaces/adventure.interface';
import { environment } from '../../../environments/environment'

@Injectable({
    providedIn: 'root'
})
export class AdventureService {
    private readonly apiUrl = `${environment.apiUrl}/adventures`;

    constructor(private http: HttpClient) { }

    // Obtener listado con mapeo de imagen principal
    getAdventures(): Observable<Adventure[]> {
        return this.http.get<Adventure[]>(this.apiUrl).pipe(
            map(adventures => adventures.map(adv => ({
                ...adv
            })))
        );
    }

    getAdventureById(id: string): Observable<Adventure> {
        return this.http.get<Adventure>(`${this.apiUrl}/${id}`);
    }
}