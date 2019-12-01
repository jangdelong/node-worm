
import cheerio from 'cheerio'

// 根据爬取的html片段整理成json数据
export const getJuejinNewsList = html => {
  const $ = cheerio.load(html)
  const list = []
  $('.entry-list > .item').each((index, item) => {
    console.log('item =>', index + ': ' + item)
    const data = {
      title: $(item).find('.title-row .title').text(),
      author: $(item).find('.username .user-popover-box a').text(),
      url: $(item).find('.entry-link').attr('href')
    }
    list.push(data)
  })

  return list
}
// 遍历图片，获取图片路径
export const findImg = (dom, callback) => {
  const $ = cheerio.load(dom)
  $('img').each((index, elem) => {
    const imgSrc = $(elem).attr('src')
    console.log(`图片路径${index}=>`, imgSrc)
    callback(imgSrc, index)
  })
}
