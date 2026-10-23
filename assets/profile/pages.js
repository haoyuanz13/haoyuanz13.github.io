const search = document.querySelector('.project-search input');
if (search) {
 let selected = 'all';
 const buttons = [...document.querySelectorAll('[data-filter]')];
 const update = () => {
  const query = search.value.trim().toLowerCase();
  let count = 0;
  for (const group of document.querySelectorAll('.catalogue-group')) {
   let matches = 0;
   for (const project of group.querySelectorAll('.catalogue-project')) {
    const visible = (selected === 'all' || selected === group.dataset.group) && project.dataset.search.includes(query);
    project.hidden = !visible;
    if (visible) { matches++; count++; }
   }
   group.hidden = matches === 0;
  }
  document.querySelector('.catalogue-count').textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
  document.querySelector('.catalogue-empty').hidden = count !== 0;
 };
 for (const button of buttons) button.addEventListener('click', () => {
  selected = button.dataset.filter;
  for (const item of buttons) item.setAttribute('aria-pressed', String(item === button));
  update();
 });
 search.addEventListener('input', update);
}
