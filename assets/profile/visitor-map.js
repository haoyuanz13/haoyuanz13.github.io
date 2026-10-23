const mapDetail = document.querySelector('.map-detail');
const map = document.querySelector('.world-map');

for (const marker of document.querySelectorAll('.visitor-marker')) {
 const show = () => { mapDetail.textContent = marker.dataset.detail || (marker.dataset.name + ' · ' + marker.dataset.count + (marker.dataset.count === '1' ? ' visitor' : ' visitors')); };
 marker.addEventListener('mouseenter', show);
 marker.addEventListener('focus', show);
 marker.addEventListener('click', show);
 marker.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); } });
}
