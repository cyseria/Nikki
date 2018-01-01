// 添加点击事件
document.body.addEventListener('click', copy, true);

// copy事件
function copy(e) {
  const text = document.querySelector('.text').textContent;
  // 找到要复制的区域
  var
    t = e.target,
    c = t.dataset.copytarget,
    inp = (c ? document.querySelector(c) : null);

  inp.value = text;

  // 要复制的区域是否可以选中
  if (inp && inp.select) {
    inp.select(); // 选中
    try {
      // 执行复制
      document.execCommand('copy');
      inp.blur();
    } catch (err) {
      alert('please press Ctrl/Cmd+C to copy');
    }
  }
}



// <label for="copy">内容:</label>
//   <div class="text">需要容</div>
//   <input type="text" id="copy" value="这里写内容" />
//   <button data-copytarget="#copy">复制</button>