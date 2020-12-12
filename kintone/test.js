(function() {
  "use strict";
  kintone.events.on('app.record.index.show', function(event) {
    // 増殖バグを防ぐ
    if (document.getElementById('test_id') !== null) {
      return;
    }

    let btn = document.createElement('button');
    btn.id = 'test_id';
    btn.innerText = '一覧のボタン';
    btn.onclick = function () {
      btn.innerText = 'クリックした';
    };
    kintone.app.getHeaderMenuSpaceElement().appendChild(btn);

    return event;
  });
})();
