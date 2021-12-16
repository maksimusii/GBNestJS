import { Comment } from './../../news/comments/comments.service';
import { News } from './../../news/news.service';

export function renderNews(news: News, comments: Comment[]): string {
  let newsHtml = '';
  newsHtml += renderNewsBlock(news, renderComments(comments));
  return `
      ${newsHtml}
  `;
}

function renderComments(comments: Comment[]): string {
  let commentsListHtml = '';
  if (comments) {
    for (const commentsItem of comments) {
      commentsListHtml += renderCommentsBlock(commentsItem);
    }
  } else {
    commentsListHtml = 'У этой новости еще нет комментариев';
  }
  return commentsListHtml;
}

function renderCommentsBlock(comments: Comment): string {
  return `
    <li class="list-group-item">
    <div class="card">
      <div class="card-header">
        ${comments.author}
      </div>
      <div class="card-body">
        <p class="card-text">${comments.message}</p>
      </div>
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Message" aria-label="Message" aria-describedby="button-addon2">
        <button class="btn btn-outline-secondary" type="button" id="button-addon2">Отправить коментарий</button>
      </div>
    </div>
    </li>
`;
}

function renderNewsBlock(news: News, commentsListHTML: string): string {
  return `
    <div class="card" style="width: 100%;">
      <div class="card-body">
        ${
          news.cover
            ? `<img src="${news.cover}" style="height: 200px; object-fit: cover;" class="card-img-top" alt="...">`
            : ''
        }
        <h5 class="card-title">${news.title}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${news.author}</h6>
        <p class="card-text">${news.description}</p>
        <ul class="list-group list-group-flush">
        ${commentsListHTML}
        </ul>
        <a href="/news/view" class="card-link">Вернуться к списку новостей</a>
      </div>
    </div>
  `;
}
