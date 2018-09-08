/**
 * 
 */
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const ejs = require('ejs');

class PGI {

    /**
     * @param options = {
     *  device : 生成图片使用的设备大小
     *  type: Specify screenshot type, can be either jpeg or png. Defaults to 'png'.
     *  quality: The quality of the image, between 0-100. Not applicable to png images
     *  fullPage: When true, takes a screenshot of the full scrollable page. Defaults to false
     *  omitBackground: Hides default white background and allows capturing screenshots with transparency. Defaults to false
     *  encoding: The encoding of the image, can be either base64 or binary. Defaults to binary
     *  clip: {x:'',y:'',width:'',height:''}  An object which specifies clipping region of the page
     *  path: The file path to save the image to
     *  launch：{} 启动 puppeteer 生成 browser 的参数 {}
     * }
     */
    constructor(options = {}){
        let defaultOptions = {
            device: 'iPhone 6 Plus',
            type: 'png',
            fullPage: false,
            omitBackground: false,
            encoding: 'binary',
            path: '',
            clip: null,
            launch: {}
        };
        this.options = Object.assign({},defaultOptions,options);
        this.browser = null;
        this.page = null;
    }

    /**
     * 内部方法,初始化需要的资源 init
     * 
     * 主要是生成 browser 和 page 对象
     */
    async init(){
        this.browser = await puppeteer.launch(this.options.launch);
        this.page = await this.browser.newPage();
        await this.page.emulate(devices[this.options.device]);
    }

    /**
     * 执行生成图片
     * htmlTemplateString: html 字符串模版
     * data : 需要填充的数据
     * 
     *  return buffer or a base64 string depending on the value of encoding
     */
    async generateImage(htmlTemplateString,data){
        try{
            let html = ejs.render(htmlTemplateString, data, {});
            // console.log('this.page',this.page);
            await this.page.setContent(html);

            let screenshotParams = {
                type: this.options.type,
                quality: this.options.quality,
                fullPage:  this.options.fullPage,
                omitBackground: this.options.omitBackground,
                encoding: this.options.encoding
            };
            if(this.options.path){
                screenshotParams.path = this.options.path
            };
            if(this.options.clip){
                screenshotParams.clip = this.options.clip
            };
            return this.page.screenshot(screenshotParams);
        }catch(err){
            throw('generateImage err',err);
            this.destroy();
        };
    }

    /**
     *  释放资源 destroy
     *  主要是 销毁 page 和 browser
     */
    async destroy(){
        await this.page.close();
        await this.browser.close();
    }
};

module.exports = PGI;

