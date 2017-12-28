const filechooser = document.getElementById('filechooser');
const preview = document.getElementById('preview');

let imgPreview = []; // 图片预览 dom
let clothesArr = []; // 衣服编号数组
const picArr = []; // 图片处理相关 promise 函数
const ocrArr = []; // 识别相关的 promise 函数

// 数组容器
let t = document.querySelector('#text'),
    area = t.content.querySelector(".textarea");

filechooser.onchange = function () {
    const files = this.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!/\/(?:jpeg|jpg|png)/i.test(file.type)) { // 只接受 jpeg, jpg, png 类型的图片
            return;
        };

        picArr.push(loadFile(file, i));
    }

    Promise.all(picArr)
        .then(() => {
            console.log('所有图片都处理完啦');
        });

};

// 处理单个图片
function loadFile(file, idx) {
    return new Promise((resolve, reject) => {
        createReader(file)
            .then(url => { // 加载图片
                return loadImg(url)
            }).then(img => { // 裁剪图片
                clipImg(img, idx);
                Promise.all(ocrArr)
                    .then(data => {
                        console.log(`加载完第 ${idx} 张...`);
                        area.value = clothesArr.join(', ');
                        document.body.appendChild(area.cloneNode(true));
                        document.body.appendChild(imgPreview[idx]);
                        clothesArr = [];
                        resolve();
                    });
            })
    })
}
// 返回图片 data url
function createReader(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
            resolve(e.target.result);
        };
        reader.readAsDataURL(file);
    })
}

// 加载图片
function loadImg(url) {
    return new Promise((resolve, reject) => {
        var image = new Image();
        image.onload = function () {
            resolve(this)
        };
        image.src = url;
    })
}

// 裁剪分割图片
function clipImg(img, idx) {
    const ele = document.createElement('div');
    imageClipper(img, function () {
        const beginX = 240,
            beginY = 210, // 初始化开始裁剪的坐标
            offsetX = 310,
            offsetY = 178, // x, y 偏移量 

            width = 50, // 被剪切图像的宽度
            height = 25; // 被剪切图像的高度

        let x, y; // 根据偏移计算后的裁剪坐标

        // 开始裁剪
        for (let i = 0; i < 7; i++) {
            y = beginY + i * offsetY;
            for (let j = 0; j < 2; j++) {
                x = beginX + j * offsetX;
                this.reset()
                    .crop(x, y, width, height)
                    .resize(width *2, height *2)
                    .toDataURL(dataUrl => { // 结果添加到 body
                        let myImage = new Image();
                        myImage.src = dataUrl;
                        ele.appendChild(myImage);
                        ocrArr.push(recoNum(dataUrl)); // 图像识别
                    });
            }
        }
        imgPreview[idx] = ele;
    });
}


function recoNum(img) {
    return new Promise((resolve, reject) => {
        Tesseract.recognize(img, {
                tessedit_char_whitelist: '0123456789',
                // lang: 'chi_sim'
            })
            // .progress(function (message) {
            //     console.log('progress is: ', message)
            // })
            .then(function (result) {
                // console.log(result.text)
                const text = result.text.replace(/\r|\n/ig, "");
                // const num = pad(parseInt(text), 3)
                // console.log(`${typeof(num)}: ${num}`)
                // 处理图片
                clothesArr.push(text);
                resolve();
            })
    })

}

function pad(num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}

const btnResult = document.getElementById('btn-result');
btnResult.addEventListener('click', e => {
    const textarea = document.querySelectorAll('.textarea');
    let totalStr = '';
    // 如果已经存在结果则直接修改 value
    let resContain = document.querySelector('.nikki-contain');
    if (!resContain) {
        const res = document.querySelector('#nikki');
        resContain = res.content.querySelector(".nikki-contain");
    }
    for (let i = 0; i < textarea.length; i++) {
        totalStr += (textarea[i].value + ',\n');
    }

    resContain.value = totalStr;
    document.body.appendChild(resContain);
})