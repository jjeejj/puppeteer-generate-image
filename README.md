# puppeteer-generate-image

利用 puppeteer 对指定的模版生成图片

### 利用模版引擎填充渲染数据,现支持的模版引擎列表:

- [html]() 原生的 `HTML`, 不进行数据渲染,直接写在 `HTML` 源码中 
- [ejs](https://github.com/mde/ejs)

### 使用方法

```
npm install puppeteer-generate-image
```

```
const PGI = require('puppeteer-generate-image')

/**
 * 创建 PGI 实例
 * options 参数 
 * @param options = {
 *  device : 生成图片使用的设备大小 值有 iPhone 6 Plus | iPhone SE | iPad | Galaxy S5 landscape 等等
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
 * htmlTemplatePath: 模版路径,需要绝对地址
 * data: 需要填充的数据
 * 该方法 可以返回 buffer or a base64 根据 实例化 new 传入的 encoding 确定的
 */
let value = await pgi.generateImage(htmlTemplatePath,data);

//销毁释放资源
await pgi.destroy();
```
>执行 new 创建实例的时候 参数 `viewport` 和  `device` 起作用的只有一个，如果 `viewport`有值，优先使用 `viewport`,若都没有指定,则是默认打开的效果 对于  `device` 的值 请参考  [DeviceDescriptors](https://github.com/GoogleChrome/puppeteer/blob/master/DeviceDescriptors.js)

>对于需要滚动截取长图,需要传入参数 `fullPage:true` 现默认是 `false`

>执行 `init` 方法后可以多次生成图片

>若生成图片任务完成后,一定要执行 `destroy` 方法 销毁资源

###  参考案例

在 `example` 文件夹下:

`index.ejs`: 是模版文件
`index.js` : 是调用该模块的业务文件
`code.js`: 是模版中使用的图片
`test.png`: 是生成的图片

>更多案例参考 [https://github.com/jjeejj/Generate-Image-Templates](https://github.com/jjeejj/Generate-Image-Templates)