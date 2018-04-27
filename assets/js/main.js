document.getElementById('portfolio_btn').addEventListener('click', () => {
  doScrolling('portfolio')
})

document.getElementById('blog_btn').addEventListener('click', () => {
  doScrolling('blog')
})

document.getElementById('contact_btn').addEventListener('click', () => {
  doScrolling('portfolio')
})

function doScrolling(id) {
  console.log('click')
  document.getElementById(id).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
}