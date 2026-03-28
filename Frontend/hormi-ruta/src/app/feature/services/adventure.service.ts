import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Adventure, CreateAdventure } from '../interfaces/adventure.interface';
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

    //crear
    PostAdventures(adventure: object): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.post<Adventure>(this.apiUrl, adventure, { headers });
    }

    PutAdventure(id: string, adventure: object): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.put<Adventure>(`${this.apiUrl}/${id}`, adventure, { headers });
    }

    getAdventureById(id: string): Observable<CreateAdventure> {
        return this.http.get<CreateAdventure>(`${this.apiUrl}/${id}`);
    }
}