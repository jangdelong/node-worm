import fs from 'fs'
import Nightmare from 'nightmare'
import request from 'request'
import { getJuejinNewsList, findImg } from './utils/index.js'


const fsPromises = fs.promises
const URLS = {
  'JUEJIN': 'https://juejin.im/',
  'IMG_SITE': 'https://jelon.info'
}
const nightmare = Nightmare({
  show: true
})

// 拉取掘金首页文章
nightmare.goto(URLS.JUEJIN)
  .wait(3000)
  .evaluate(() => document.querySelector('div.welcome__feed').innerHTML)
  .then(htmlStr => {
    const newsListData = JSON.stringify(getJuejinNewsList(htmlStr))
    fsPromises.mkdir('./data/', { recursive: true }).then(() => {
      fs.writeFile(`./data/json.json`, newsListData, 'utf-8', err => {
        if (err === null) {
          console.log('恭喜您，newsListData数据爬取成功!')
        }
      })
    })
  })
  .catch(err => {
    console.log(`数据抓取失败 - ${err}`)
  })

// 图片爬取
function start () {
  request(encodeURI(URLS.IMG_SITE), (err, res, body) => {
    if (!err && res) {
      console.log('开始爬取图片 \n')
      findImg(body, downLoad)
    } else {
      console.log(err)
    }
  })
}
// 图片下载
function downLoad (imgUrl, index) { 
  // 再次发起请求，写文件
  function downloadImg (imgUrl, index) {
    const ext = imgUrl.split('.').pop()
    request(encodeURI(URLS.IMG_SITE + imgUrl)).pipe(
      fs.createWriteStream(
      `./data/img/` + index + '.' + ext
      ),
      {
        'encoding': 'utf8',
      }
    )
  }
  if (index === 0) {
    fsPromises.mkdir('./data/img/', { recursive: true }).then(() => {
      downloadImg(imgUrl, index)
    })
  } else {
    downloadImg(imgUrl, index)
  }
  console.log(`正在下载图片: ${imgUrl}`)
}

start()
