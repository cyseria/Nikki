const filechooser = document.getElementById('filechooser');
const preview = document.getElementById('preview');

const clothesArr = []; // 衣服编号数组
const ocrArr = []; // 识别相关的 promise 函数

filechooser.onchange = function () {
    const files = this.files;
    let promise = Promise.resolve();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!/\/(?:jpeg|jpg|png)/i.test(file.type)) { // 只接受 jpeg, jpg, png 类型的图片
            return;
        };
        promise = promise
            .then(() => { // 创建 FileReader
                return createReader(file);
            })
            .then(url => { // 加载图片
                return loadImg(url)
            }).then(img => { // 裁剪图片
                clipImg(img);

                Promise.all(ocrArr).then(data => {
                    console.log('check done');
                    console.log(clothesArr);
                });
            })
    }

};

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
function clipImg(img) {
    imageClipper(img, function () {
        const beginX = 240,
            beginY = 210, // 初始化开始裁剪的坐标
            offsetX = 310,
            offsetY = 178, // x, y 偏移量 
            width = 70, // 被剪切图像的宽度
            height = 25; // 被剪切图像的高度

        let x, y; // 根据偏移计算后的裁剪坐标

        // 开始裁剪
        for (let i = 0; i < 7; i++) {
            y = beginY + i * offsetY;
            for (let j = 0; j < 2; j++) {
                x = beginX + j * offsetX;

                this.reset()
                    .crop(x, y, width, height)
                    .toDataURL(dataUrl => { // 结果添加到 body
                        let myImage = new Image();
                        myImage.src = dataUrl;
                        document.body.appendChild(myImage);

                        ocrArr.push(recoNum(dataUrl)); // 图像识别
                    });
            }
        }
    });
}


function recoNum(img) {
    return new Promise((resolve, reject) => {
        Tesseract.recognize(img, {
                // lang: 'chi_sim',
                // from_cache: true
            })
            // .progress(function (message) {
            //     console.log('progress is: ', message)
            // })
            .then(function (result) {
                console.log(result.text)
                clothesArr.push(result.text);
                resolve();
            })
    })

}