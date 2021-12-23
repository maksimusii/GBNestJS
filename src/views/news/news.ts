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
      let replayComentHtml = '';
      if (commentsItem.hasOwnProperty('replayComments')) {
        for (const replayComments of commentsItem.replayComments) {
          replayComentHtml += renderReplayCommentsBlock(replayComments);
        }
      }
      commentsListHtml += renderCommentsBlock(commentsItem, replayComentHtml);
    }
  } else {
    commentsListHtml = 'У этой новости еще нет комментариев';
  }
  return commentsListHtml;
}

function renderCommentsBlock(
  comments: Comment,
  replayComments?: string,
): string {
  return `
    <li class="list-group-item">
    <div class="card">
    ${
      comments.avatar
        ? `<img src="${comments.avatar}" style="height: 200px; object-fit: cover;" class="card-img-top" alt="...">`
        : ''
    }
      <div class="card-header">
        ${comments.author}
      </div>
      <div class="card-body">
        <p class="card-text">${comments.message}</p>
      </div>
      ${replayComments}
    </div>
    </li>
`;
}
function renderReplayCommentsBlock(replay: Comment): string {
  return `
    <li class="list-group-item">
      <div class="card">
        <div class="card-header">
            ${replay.author}: 
            <div class="card-body">
              <p class="card-text">${replay.message}</p>
            </div>
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
