async function deleteReply(commentId, replyId, postId) {
  const res = await fetch(`/post/${postId}/comment/${commentId}/reply/${replyId}/delete`, {
    method: "DELETE"
  });

  if (res.ok) window.location.href = `/post/${postId}/comments`;
}

async function likeReply(postId, commentId, replyId, button) {
  const res = await fetch(`/post/${postId}/comment/${commentId}/reply/${replyId}/like`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  const data = await res.json();
  console.log(data);
  const { isLiked, likesCount } = data;
  updateLikeElement(isLiked, likesCount, button);
}

function updateLikeElement(isLiked, likesCount, button) {
  if (isLiked)
    button.querySelector('.js-like-img').src = "/public/images/star-fill.png";

  else
    button.querySelector('.js-like-img').src = "/public/images/star.png";

  button.querySelector('.js-like-cnt').textContent = likesCount;
}

document.querySelectorAll('.js-delete-reply-btn').forEach(button => {
  button.addEventListener('click', () => {
    let confirmation = confirm("Are you sure to delete that reply?");
    if (confirmation) deleteReply(
      button.closest('.js-comment-container').querySelector('.js-comment').dataset.commentId,
      button.closest('.js-reply').dataset.replyId, 
      button.closest('.js-post').dataset.postId
    );
  });
});

document.querySelectorAll('.js-reply-btn').forEach(button => {
  button.addEventListener('click', () => {
    button.closest('.js-comment-container').querySelector('.js-reply-card')
      .classList.toggle('js-hidden');
  })
});

document.querySelectorAll('.js-like-reply-btn').forEach(button => {
  button.addEventListener('click', () => {
    likeReply(
      button.closest('.js-post').dataset.postId,
      button.closest('.js-comment-container').querySelector('.js-comment').dataset.commentId,
      button.closest('.js-reply').dataset.replyId,
      button
    )
  });
});