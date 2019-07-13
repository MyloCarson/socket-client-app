import { Injectable } from '@angular/core';
import * as socket from 'socket.io-client';
import * as Rx from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private baseUrl = 'http://127.0.0.1:5000/'
  constructor() { }

  message(groupId: string) {
    return new Rx.Observable<any> ( observer => {
      socket(`${this.baseUrl}?groupId=${groupId}`, {
        path: '/message'
      }).addEventListener('message', data => {
        console.log('[message]', data);
        observer.next(data);
      })
    });
  }

  group() {
    return new Rx.Observable<any> ( observer => {
      socket(`${this.baseUrl}`, {
        path: '/group'
      }).addEventListener('group', data => {
        console.log('[message]', data);
        observer.next(data);
      })
    });
  }
}
