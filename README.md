# puppeteer-generate-image

利用 puppeteer 对指定的模版生成图片

### 利用模版引擎填充渲染数据,现支持的模版引擎列表:

- [ejs](https://github.com/mde/ejs)

### 使用方法

```
const PGI = require('puppeteer-generate-image')

/**
 * 创建 PGI 实例
 * options 参数 
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
 *  omitBackground: Hides default white background and allows capturing screenshots with transparency.    *                  Defaults to false
 *  encoding: The encoding of the image, can be either base64 or binary. Defaults to binary
 *  clip: {x:'',y:'',width:'',height:''}  An object which specifies clipping region of the page
 *  path: The file path to save the image to
 *  launch：{} 启动 puppeteer 生成 browser 的参数 {}
 * }
 *／
const pgi = new PGI(options); //options 参数

//执行 init 方法
await pgi.init();

/**
 * 执行生成图片的方法
 * htmlTemplatePath: 模版路径,需要绝对地址 ，现在只支持 ejs 
 * data: 需要填充的数据
 * 该方法 可以返回 buffer or a base64 根据 实例化 new 传入的 encoding 确定的
 */
let value = await pgi.generateImage(htmlTemplatePath,data);

//销毁释放资源
await pgi.destroy();
```
>执行 new 创建实例的时候 参数 `viewport` 和  `device` 起作用的只有一个用一个 ，如果 `viewport`有值，优先使用 `viewport`

>执行 `init` 方法后可以多次生成图片

>若生成图片任务完成后,一定要执行 `destroy` 方法 销毁资源
