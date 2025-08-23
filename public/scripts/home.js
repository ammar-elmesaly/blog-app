async function deletePost(id) {
  const res = await fetch(`https://localhost:3000/delete/post/${id}`, {
    method: "DELETE",
  });

  if (res.ok) window.location.href = '/';
}

document.querySelectorAll('.delete-post-btn')
  .forEach(button => {
    button.addEventListener('click', () => {
      let res = confirm("Are you sure to delete that post?");
      if (res) deletePost(button.dataset.postId);
    });
  });