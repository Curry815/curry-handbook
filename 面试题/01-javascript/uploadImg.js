// 实现一个方法，能上传多张图片，保持单次n张上传，n张里如果有1张已经上传成功，然后就补上1张，就一直维持n张图片同时在上传
const urls = [
    'http://1.jpg',
    'http://2.jpg',
    'http://3.jpg',
    'http://4.jpg',
    'http://5.jpg',
    'http://6.jpg',
    'http://7.jpg',
    'http://8.jpg',
    'http://9.jpg',
    'http://10.jpg',
    'http://11.jpg',
    'http://12.jpg',
    'http://13.jpg',
    'http://14.jpg',
    'http://15.jpg',
    'http://16.jpg',
    'http://17.jpg',
    'http://18.jpg',
    'http://19.jpg',
    'http://20.jpg',
]

// 模拟上传
const uploadImg = (url) => {
    return new Promise(resolve => {
        console.log(`[开始]${url}`);
        setTimeout(() => {
            resolve(url);
            console.log(`[上传完成]${url}`);
        }, 300 * Math.random())
    });
}

// 1.并发5张
// 2.补充间隔100ms，上传下一张
const warpRequest = (imgList) => {
    const resultMap = {};
    imgList.forEach(url => {
        resultMap[url] = false;
    });

    let index = 0;

    return new Promise(resolve => {
        const download = () => {
            // 跳出条件
            if (index >= imgList.length) {
                if (!Object.keys(resultMap).find(key => resultMap[key] === false)) {
                    resolve(resultMap);
                }
                return;
            }

            // 上传图片
            const tempUrl = imgList[index];
            uploadImg(tempUrl).then(res => {
                resultMap[tempUrl] = res;
                setTimeout(download, 100);
            });

            // 计数器 +1
            ++index;
        }

        while (index < 5) {
            download();
        }
    });
}

(async () => {
    const result = await warpRequest(urls);
    console.log(result);
})();

