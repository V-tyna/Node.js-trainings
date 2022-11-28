const techList$ = document.getElementById('techList');

if (techList$) {
  techList$.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-tech')) {
      const id = e.target.dataset.id;
      const _csrf = e.target.dataset.csrf;

      fetch('/learningList/delete/' + id, {
        method: 'delete',
        body: JSON.stringify({
          _csrf
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(() => window.location = '/learningList');
    }
  })
}

M.Tabs.init(document.querySelectorAll('.tabs'));
