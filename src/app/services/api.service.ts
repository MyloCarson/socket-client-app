import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Message from '../model/message';
import { HttpClient } from '@angular/common/http';
import Group from '../model/group';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:5000/';
  constructor(private http: HttpClient) { }

  fetchAllMessages(groupId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}messages/${groupId}`);
  }

  sendMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.baseUrl}messages/${message.groupId}`, message);
  }

  fetchAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.baseUrl}groups`);
  }

  createGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(`${this.baseUrl}groups`, group);
  }
}
