// The provider counts a visit when its image is requested, not when data is read.
// Never record local previews as visits to the public website.
if (window.location.hostname === 'haoyuanz13.github.io') {
  const counter = new Image(1, 1);
  counter.alt = '';
  counter.setAttribute('aria-hidden', 'true');
  counter.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;pointer-events:none;opacity:0';
  counter.src = 'https://s01.flagcounter.com/count2/GMWI/bg_FCFDFD/txt_61717D/border_FCFDFD/columns_1/maxflags_1/viewers_0/labels_0/pageviews_0/flags_0/percent_0/?t=' + Date.now();
  document.body.appendChild(counter);
}
