import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Board, BoardCreate, BoardDetails } from "../models/board";
import { environment } from "../../environments/environment";
import { ListQuery, ResultPage } from "../models/page";
import { prepareHttpParams } from "../modules/shared/helpers/http";

@Injectable({
  providedIn: 'root'
})
export class BoardApiService {

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  create(form: BoardCreate): Observable<Board> {
    return this.httpClient.post<Board>(environment.apiEndpoint + 'goals/board/create', form);
  }

  update(form: BoardDetails, id: number): Observable<BoardDetails> {
    return this.httpClient.put<BoardDetails>(environment.apiEndpoint + 'goals/board/' + id, form);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(environment.apiEndpoint + 'goals/board/' + id);
  }

  loadList(query: ListQuery): Observable<ResultPage<Board>> {
    return this.httpClient.get<ResultPage<Board>>(environment.apiEndpoint + 'goals/board/list', {
      params: prepareHttpParams(query)
    });
  }

  loadFullList(): Observable<Board[]> {
    return this.httpClient.get<Board[]>(environment.apiEndpoint + 'goals/board/list');
  }

  loadDetail(id: number): Observable<BoardDetails> {
    return this.httpClient.get<BoardDetails>(environment.apiEndpoint + 'goals/board/' + id);
  }
}
