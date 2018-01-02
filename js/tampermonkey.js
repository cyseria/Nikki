// ==UserScript==
// @name         New ES6-Userscript
// @namespace    http://seal100x.github.io/nikkiup2u3/
// @version      0.1
// @description  自动复制名称改
// @author       蔓青
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        http://*/*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
    /* jshint ignore:end */
        /* jshint esnext: false */
        /* jshint esversion: 6 */
    
        // Your code here...
        // 创建容器
        let idx, max, arr;
        var div = document.createElement("div");
        div.innerHTML = "<label for='copy'>内容:</label><input type='text' id='copy' value='这里写内容' />";
        document.body.appendChild(div);
    
        function init() {
            // 记录index
            idx = 0;
            max = 0;
            arr = [];
            // 选择出元素
            const clothes = document.querySelector('#shoppingCart');
            const table = clothes.querySelector('.table-body');
            const rows = table.querySelectorAll('.table-row');
            max = rows.length;
            for (let i = 1; i < rows.length; i++) {
                const td = rows[i].querySelectorAll('.table-td');
                arr.push(td[1].textContent);
            }
        }
    
          // 监听键盘事件
        document.addEventListener('keydown', (event) => {
            const keyName = event.key;
            if (keyName === ',') {
                init();
                alert('初始化成功');
                console.log(arr);
            }
            if (keyName === '.') {
                console.log(`${arr[idx]}`);
                let inp = document.querySelector('#copy');
                inp.value = arr[idx];
                idx ++;
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
        });
    
    /* jshint ignore:start */
    ]]></>).toString();
    var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
    eval(c.code);
    /* jshint ignore:end */