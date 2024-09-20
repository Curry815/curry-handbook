// 实现下载图片功能
function downloadImage(src, imgName) {
    let image = new Image();
    image.src = src;
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function () {
        let c = document.createElement("canvas");
        c.width = image.width;
        c.height = image.height;
        c.getContext("2d").drawImage(image, 0, 0, image.width, image.height);
        let a = document.createElement("a");
        a.download = imgName;
        a.href = c.toDataURL("image/png");
        a.click();
    }
}