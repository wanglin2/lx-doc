const oss = new window.OSS_APP({
    accessKeyId: '',
    accessKeySecret: '',
    type: 'BOW',
    region: '',
    bucket: '',
    dir: 'board',
    randomName: true
});

const handleAliyunUrl = (url) => {
    return `` + url;
}

export default {
    // base64转blob
    dataURLtoBlob(dataurl) {
        let arr = dataurl.split(',');
        //注意base64的最后面中括号和引号是不转译的   
        let _arr = arr[1].substring(0, arr[1].length - 2);
        let mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(_arr),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime
        });
    },

    /**
     *  上传图片
     *
     * @param {*} file
     * @param {*} config
     * @returns
     */
    uploadImg(file, isDataURL = true) {
        return new Promise((resolve, reject) => {
            let blob = isDataURL ? this.dataURLtoBlob(file) : file
            oss.uploadFile(
                blob,
                () => { },
                async (ev) => {
                    if (ev && ev.length > 0) {
                        let imgUrl = handleAliyunUrl(ev[0].name);
                        resolve(imgUrl)
                    }
                },
                (ev) => {
                    if (ev.length > 0) {
                        reject("图片上传失败，请重试");
                    }
                }
            );
        });
    },
}