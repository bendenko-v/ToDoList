import { Injectable } from '@angular/core';
import { CommentsApiService } from "./comments-api.service";
import { CommentDTO, CommentRequest, CommentsQuery } from "../models/comment";
import { Observable, Subject, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { ResultPage } from "../models/page";
import { prepareHttpParams } from "../modules/shared/helpers/http";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  refresh$ = new Subject<void>();

  constructor(
    private commentsApiService: CommentsApiService,
  ) {
  }

  updateComment(request: CommentRequest, id: number): Observable<CommentDTO> {
    return this.commentsApiService.updateComment(request, id).pipe(
      tap(() => this.refresh$.next())
    )
  }

  loadList(query: CommentsQuery): Observable<ResultPage<CommentDTO>> {
    return this.commentsApiService.loadList(query);
  }

  addComment(request: CommentRequest): Observable<CommentDTO> {
    return this.commentsApiService.addComment(request).pipe(
      tap(() => this.refresh$.next())
    );
  }

  deleteComment(id: number): Observable<void> {
    return this.commentsApiService.deleteComment(id).pipe(
      tap(() => this.refresh$.next())
    );
  }
}
