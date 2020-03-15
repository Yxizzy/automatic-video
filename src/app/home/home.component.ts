import {Component, OnInit} from '@angular/core';
import {HttpService} from '../services/http.service';
import {ActivatedRoute, Params} from '@angular/router';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Snippet} from '../models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  //component variables
  title = 'Moment from meeting with Two Pillars';
  snippets: Array<Snippet> = [];
  error: boolean | string = false;
  id: string;
  public apiUrl = environment.apiLink;

  constructor(
    private http: HttpService,
    private activeRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      this.getSnippets(params).subscribe();
    });
  }

  /**
   * get the id paramete
   * if success, call sortSnippets() with response to sort transcript
   * on error, set error with appropriate error message
   */
  getSnippets(params: Params) {
    return new Observable(resolve => {
      this.id = params.id;
      if (this.id) {
        this.http.getSnippets(this.id)
          .subscribe(
            (response: Snippet[]) => {
              this.snippets = this.sortSnippets(response);
              resolve.next(this.error);
            },
            () => {
              this.setError('Oops!!!', `Video with this ID does not exist`);
              resolve.next(this.error);
            });
      } else {
        this.setError('Something went wrong!!!', 'Please Provide A Valid Video ID');
        resolve.next(this.error);
      }
    });
  }

  setError(title: string, message: string) {
    this.title = title;
    this.error = message;
  }

  //sort transcripts by time
  sortSnippets(snippet: Snippet[]) {
    return snippet.sort((a, b) => (a.time - b.time));
  }

}
