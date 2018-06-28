document.getElementById('portfolio_btn').addEventListener('click', () => {
  doScrolling('portfolio')
})

document.getElementById('blog_btn').addEventListener('click', () => {
  doScrolling('blog')
})

document.getElementById('about_me_btn').addEventListener('click', () => {
  doScrolling('aboutme')
})

function doScrolling(id) {
  console.log('click')
  document.getElementById(id).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
}