(() => {
  const map = document.querySelector('.world-map');
  const detail = document.querySelector('.map-detail');
  if (!map) return;
  const svgNS = 'http://www.w3.org/2000/svg';
  const source = 'https://raw.githubusercontent.com/haoyuanz13/haoyuanz13.github.io/master/assets/profile/visitor-data.json';
  const publishedSource = new URL('visitor-data.json', document.currentScript.src).href;
  let loading = false;
  let lastUpdated = -Infinity;

  function bind(marker) {
    const show = () => {
      if (detail) detail.textContent = marker.dataset.detail || `${marker.dataset.name} · ${marker.dataset.count} ${Number(marker.dataset.count) === 1 ? 'visitor' : 'visitors'}`;
    };
    marker.addEventListener('mouseenter', show);
    marker.addEventListener('focus', show);
    marker.addEventListener('click', show);
    marker.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); show(); }
    });
  }
  map.querySelectorAll('.visitor-marker').forEach(bind);

  function dot(row, sample = false) {
    const lon = Number(row.longitude), lat = Number(row.latitude);
    if (!Number.isFinite(lon) || !Number.isFinite(lat) || Math.abs(lon) > 180 || Math.abs(lat) > 90) return null;
    const name = row.country ? `${row.name}, ${row.country}` : row.name;
    const label = sample ? `${name} · Sample location (regional data unavailable)` : `${name}: ${row.visitors} ${row.visitors === 1 ? 'visitor' : 'visitors'}`;
    const marker = document.createElementNS(svgNS, 'g');
    marker.classList.add('visitor-marker');
    if (sample) marker.classList.add('visitor-sample');
    marker.setAttribute('tabindex', '0');
    marker.setAttribute('role', 'button');
    marker.setAttribute('aria-label', label);
    marker.dataset.name = name;
    marker.dataset.count = row.visitors ?? '';
    if (sample) marker.dataset.detail = label;
    const title = document.createElementNS(svgNS, 'title');
    title.textContent = label;
    marker.appendChild(title);
    const radius = sample ? 3 : 2.5 + Math.sqrt(row.visitors) * 0.22;
    for (const halo of [true, false]) {
      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('cx', ((lon + 180) * 2).toFixed(2));
      circle.setAttribute('cy', ((82 - lat) * 2.5).toFixed(2));
      circle.setAttribute('r', (radius + (halo ? 3 : 0)).toFixed(2));
      circle.setAttribute('fill', '#215ce0');
      if (halo) circle.setAttribute('opacity', '.1');
      else { circle.setAttribute('stroke', '#fff'); circle.setAttribute('stroke-width', '1.2'); }
      marker.appendChild(circle);
    }
    bind(marker);
    return marker;
  }

  function render(data) {
    if (!Array.isArray(data.data) || !data.data.length || data.data.some(row => !row.name || !Number.isInteger(row.visitors) || row.visitors < 0)) throw new Error('Invalid visitor data');
    const timestamp = Date.parse(data.updated_at || data.updated + 'T00:00:00Z');
    if (!Number.isFinite(timestamp) || timestamp < lastUpdated) return;
    const total = data.data.reduce((sum, row) => sum + row.visitors, 0);
    const regions = Array.isArray(data.regional_data) ? data.regional_data : [];
    const samples = data.illustrative_positions?.locations || [];
    const countryNames = new Set(data.data.map(row => row.name));
    const unresolved = new Set((data.unresolved_regions || []).map(row => row.country));
    const fragment = document.createDocumentFragment();
    function append(row, sample) { const marker = dot(row, sample); if (marker) fragment.appendChild(marker); }
    for (const row of data.data) {
      const children = regions.filter(region => region.country === row.name);
      const countrySamples = samples.filter(sample => sample.name.endsWith(', ' + row.name));
      if (children.length) children.forEach(child => append(child, false));
      else if (!countrySamples.length) append(row, false);
    }
    for (const row of samples) {
      const country = [...countryNames].find(name => row.name.endsWith(', ' + name));
      if (country && (!regions.some(region => region.country === country) || unresolved.has(country))) append(row, true);
    }
    map.querySelectorAll('.visitor-marker').forEach(marker => marker.remove());
    map.appendChild(fragment);
    const metrics = document.querySelectorAll('.visitor-metrics strong');
    if (metrics[0]) metrics[0].textContent = total.toLocaleString('en-US');
    if (metrics[1]) metrics[1].textContent = data.data.length.toLocaleString('en-US');
    lastUpdated = timestamp;
    const updated = document.querySelector('.visitor-updated');
    const when = new Date(data.updated_at || data.updated + 'T00:00:00Z');
    if (updated && Number.isFinite(when.getTime())) {
      updated.textContent = 'Flag Counter · Updated ' + when.toLocaleString('en-GB', {timeZone:'Asia/Shanghai',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}) + ' CST';
    }
  }

  async function refresh() {
    if (loading || document.hidden) return;
    loading = true;
    try {
      const stamp = Date.now();
      const snapshots = await Promise.allSettled([publishedSource, source].map(async url => {
        const response = await fetch(url + '?t=' + stamp, {cache:'no-store',signal:AbortSignal.timeout(12000)});
        if (!response.ok) throw new Error('Visitor snapshot unavailable');
        return response.json();
      }));
      const candidates = snapshots.filter(result => result.status === 'fulfilled').map(result => result.value);
      candidates.sort((a,b) => Date.parse(b.updated_at || b.updated) - Date.parse(a.updated_at || a.updated));
      for (const candidate of candidates) {
        try { render(candidate); break; } catch (_) { /* Try the other source. */ }
      }
    } catch (_) {
      // Keep the last successfully published snapshot during temporary outages.
    } finally { loading = false; }
  }
  refresh();
  setInterval(refresh, 5 * 60 * 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
})();
