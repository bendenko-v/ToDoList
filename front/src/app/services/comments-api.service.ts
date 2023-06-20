import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { CommentDTO, CommentRequest, CommentsQuery } from "../models/comment";
import { ResultPage } from "../models/page";
import { prepareHttpParams } from "../modules/shared/helpers/http";

@Injectable({
  providedIn: 'root'
})
export class CommentsApiService {

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  loadList(query: CommentsQuery): Observable<ResultPage<CommentDTO>> {
    return this.httpClient.get<ResultPage<CommentDTO>>(environment.apiEndpoint + 'goals/goal_comment/list', {
      params: prepareHttpParams(query)
    });
  }

  addComment(request: CommentRequest): Observable<CommentDTO> {
    return this.httpClient.post<CommentDTO>(environment.apiEndpoint + 'goals/goal_comment/create', request);
  }

  updateComment(request: CommentRequest, id: number): Observable<CommentDTO> {
    return this.httpClient.put<CommentDTO>(environment.apiEndpoint + 'goals/goal_comment/' + id, request);
  }

  deleteComment(id: number): Observable<void> {
    return this.httpClient.delete<void>(environment.apiEndpoint + 'goals/goal_comment/' + id);
  }
}
