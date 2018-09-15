/**
 * 利用 puppeteer 对制定的模版生成图片
 */
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

class PGI {
    /**
     * @param options = {
     *  device : 生成图片使用的设备大小
     *  viewport: {
     *    width <number> page width in pixels.
     *    height <number> page height in pixels.
     *    deviceScaleFactor <number> Specify device scale factor (can be thought of as dpr). Defaults to 1.
     *    isMobile <boolean> Whether the meta viewport tag is taken into account. Defaults to false.
     *    hasTouch<boolean> Specifies if viewport supports touch events. Defaults to false
     *    isLandscape <boolean> Specifies if viewport is in landscape mode. Defaults to false.
     *  }
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
            viewport: null, // viewport 和  device 用一个 ，如果 viewport有值，优先使用 viewport
            type: 'png',
            fullPage: false,
            omitBackground: false,
            encoding: 'binary',
            path: '',
            clip: null,
            launch: {            
                args: ['--no-sandbox'],
                ignoreHTTPSErrors: true,
                // headless:false,
                handleSIGINT: true,
                timeout: 300 * 1000
            }
        };
        this.options = Object.assign({},defaultOptions,options);
        this.browser = null;
        this.page = null;
    }
    /**
     * 内部方法,初始化需要的资源 init
     * 主要是生成 browser 和 page 对象
     */
    async init(){
        this.browser = await puppeteer.launch(this.options.launch);
        this.page = await this.browser.newPage();
        await this.page.setJavaScriptEnabled(true);
        if(this.options.viewport){
            await this.page.setViewport(this.options.viewport);
        }else{
            await this.page.emulate(devices[this.options.device]);
        };
    }
    /**
     * 执行生成图片
     * htmlTemplatePath: 模版路径,需要绝对地址
     * data : 需要填充的数据
     *  return buffer or a base64 string depending on the value of encoding
     */
    async generateImage(htmlTemplatePath,data){
        try{
            if(path.isAbsolute(htmlTemplatePath) && fs.existsSync(htmlTemplatePath)){
                let htmlTemplateExtname = path.extname(htmlTemplatePath).replace('.',''),
                    htmlTemplateDirname = path.dirname(htmlTemplatePath),html = '',
                    htmlTemplateContent = fs.readFileSync(htmlTemplatePath,'utf8');
                if(htmlTemplateExtname == 'html' || htmlTemplateExtname == 'htm'){
                    html = htmlTemplateContent;
                };
                if(htmlTemplateExtname == 'ejs'){
                    html = ejs.render(htmlTemplateContent, data, {});
                };
                let tempHtmlFilePath = path.join(htmlTemplateDirname,`${Date.now()}.html`);
                fs.writeFileSync(tempHtmlFilePath,html);
                // await this.page.setContent(html);
                await this.page.goto(`file:${tempHtmlFilePath}`);

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
                fs.unlinkSync(tempHtmlFilePath);// 删除生成的临时问价
                return this.page.screenshot(screenshotParams);

            }else{
                // await this.destroy();
                throw new Error(`请传入一个存在的绝对路径的 模版文件: ${htmlTemplatePath}`);
            };
        }catch(err){
            await this.destroy();
            throw err;
        };
    }
    /**
     *  释放资源 destroy
     *  主要是 销毁 page 和 browser
     */
    async destroy(){
        try{
            await this.page.close();
            await this.browser.close();
        }catch(err){
            throw('destroy err',err);
        };
    }
};

module.exports = PGI;

