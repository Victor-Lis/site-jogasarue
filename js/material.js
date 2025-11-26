function voltarPagina() {
  window.history.back();
}

/* Redimensiona coordenadas do image map para manter áreas clicáveis responsivas */
function resizeImageMap() {
  const imgs = document.querySelectorAll('img[usemap].responsive-map');

  imgs.forEach(function (img) {
    const mapName = img.getAttribute('usemap').replace('#', '');
    const map = document.querySelector('map[name="' + mapName + '"]');
    if (!map) return;

    const areas = map.querySelectorAll('area');

    // Guarda as coordenadas originais (baseadas na largura natural) no primeiro run
    if (!img.dataset.coordsStored) {
      areas.forEach(function (area) {
        area.dataset.originalCoords = area.coords;
      });
      img.dataset.coordsStored = 'true';
    }

    const naturalWidth = img.naturalWidth || img.width;
    const naturalHeight = img.naturalHeight || img.height;
    if (!naturalWidth || !naturalHeight) return;

    const currentWidth = img.clientWidth;
    const currentHeight = img.clientHeight;

    const scaleX = currentWidth / naturalWidth;
    const scaleY = currentHeight / naturalHeight;

    areas.forEach(function (area) {
      const original = area.dataset.originalCoords;
      if (!original) return;
      const coords = original.split(',').map(function (c) { return parseFloat(c); });
      const scaled = coords.map(function (coord, index) {
        // even index -> x, odd index -> y
        return Math.round(coord * (index % 2 === 0 ? scaleX : scaleY));
      });
      area.coords = scaled.join(',');
    });
  });
}

// Debounce simples para resize
let _resizeTimeout;
function debounceResize() {
  clearTimeout(_resizeTimeout);
  _resizeTimeout = setTimeout(resizeImageMap, 100);
}

window.addEventListener('load', function () {
  resizeImageMap();
});

window.addEventListener('resize', debounceResize);