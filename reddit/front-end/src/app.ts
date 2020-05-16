import { fromEvent, of, Observable } from 'rxjs';
import { map, switchMap, catchError, mergeMap } from 'rxjs/operators';
import { fromFetch } from 'rxjs/fetch';
import { AjaxResponse, ajax, AjaxRequest } from 'rxjs/ajax';
import { ajaxPost } from 'rxjs/internal/observable/dom/AjaxObservable';

const postSection: HTMLElement = document.getElementsByTagName('section')[0];

const submitInfo: HTMLParagraphElement = document.getElementById(
  'submit-info'
) as HTMLParagraphElement;
const postTitle: HTMLHeadElement = document.getElementById('content-header');
const voteCount: HTMLDivElement = document.getElementById(
  'vote-counter'
) as HTMLDivElement;

const post: HTMLElement = document.getElementById('post');

const submitNewPostForm: HTMLFormElement = document.querySelector('form');
const submitPostTitle: HTMLInputElement = document.getElementById(
  'submit-post-title'
) as HTMLInputElement;
const submitPostUrl: HTMLInputElement = document.getElementById(
  'submit-post-url'
) as HTMLInputElement;

const deletePostBtn: HTMLCollectionOf<HTMLButtonElement> = document.getElementsByTagName(
  'button'
);

console.log(submitNewPostForm);
//creating new post
const createNewPost$: Observable<AjaxRequest> = ajax({
  url: 'http://localhost:3000/posts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: {
    title: submitPostTitle.value,
    url: submitPostUrl.value,
    owner: 'Donald Trump',
    timestamp: 2,
    score: 0,
    vote: 0,
  },
}).pipe(
  map((response) => console.log('response: ', response)),
  catchError((error) => {
    console.log('error: ', error);
    return of(error);
  })
);

fromEvent(submitNewPostForm, 'submit')
  .pipe(
    map((event) => event.preventDefault()),
    switchMap(() =>
      ajaxPost('http://localhost:3000/posts', {
        title: submitPostTitle.value,
        url: submitPostUrl.value,
        owner: 'Donald Trump',
        timestamp: 2,
        score: 0,
        vote: 0,
      })
    ),
    catchError((error: any) => {
      console.log('error: ', error);
      return of(error);
    })
  )
  .subscribe(console.log);

//click on submit button to create a new post

const identifier = deletePostBtn[0];
console.log('parent nodes', identifier.parentElement.id);

//delete post by article id
const deletePost$: Observable<AjaxRequest> = ajax({
  url: `http://localhost:3000/posts/:id/delete`,
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
  body: {
    id: 2,
  },
}).pipe(
  map((response: AjaxResponse) => console.log('response: ', response)),
  catchError((error: any) => {
    console.log('error: ', error);
    return of(error);
  })
);

const deletePost = fromEvent(deletePostBtn, 'click').pipe(
  switchMap(() => deletePost$)
);

function displayInfo(x: any): void {
  for (let i = 0; i < x.length; i++) {
    const article: HTMLElement = post;
    const clonedPost: Node = post.cloneNode(true);
    postSection.insertBefore(clonedPost, postSection.childNodes[2]);
    postTitle.innerHTML = x[i].title + ` ${x[i].id}`;
    voteCount.innerHTML = x[i].vote;
    submitInfo.innerText = `Submitted ${x[i].timestamp} years ago by ${x[i].owner}`;
    article.id = x[i].id;
    // deletePost.id = `delete-post-${x[i].id}`;
  }
}

//fetch all posts
const data$: Observable<AjaxRequest> = fromFetch(
  'http://localhost:3000/posts'
).pipe(
  switchMap((response: Response) => {
    if (response.ok) {
      return response.json();
    } else {
      return of({ error: true, message: `Error ${response.status}` });
    }
  }),
  catchError((error: Error) => {
    console.error(error);
    return of({ error: true, message: error.message });
  })
);
//use helper function to output data into the DOM and copy event listeners for cloned nodes
data$
  .pipe(
    map((x: AjaxRequest) => displayInfo(x)),
    switchMap(() => deletePost)
  )
  .subscribe(console.log);

// data$.subscribe((x: AjaxRequest) => {
//   displayInfo(x);
// });
