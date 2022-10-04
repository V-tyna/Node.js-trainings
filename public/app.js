const techList$ = document.getElementById('techList');

if (techList$) {
  techList$.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-tech')) {
      const id = e.target.dataset.id;

      fetch('/learningList/delete/' + id, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(() => window.location = '/learningList');
    }
  })
}

