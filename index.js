addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// Rewrite html text contents ---------------------------------------------------------------
class ContentRewriter {
  constructor(content) {
    this.content = content;
  }

  element(element) {
    element.setInnerContent(this.content);
  }
}

// Rewrite attribute of element
class AttributeRewriter {
  constructor(attributeName, content) {
    this.attributeName = attributeName;
    this.content = content;
  }

  element(element) {
    if (element.getAttribute(this.attributeName)) {
      element.setAttribute(this.attributeName, this.content);
    }
  }
}

const rewriter = new HTMLRewriter()
  .on('title', new ContentRewriter('My Project'))
  .on('h1#title', new ContentRewriter("Frank's application"))
  .on('p#description', new ContentRewriter('Learning HTMLWriter 101'))
  .on('a#url', new ContentRewriter('LinkedIn Profile'))
  .on('a#url', new AttributeRewriter('href', 'https://www.linkedin.com/in/frank-ge/'))

//------------------------------------------------------------------------------------------

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  // url
  const url = 'https://cfw-takehome.developers.workers.dev/api/variants';
  
  // fetch the 2 options
  let variants = await fetch(url)
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data["variants"];
    });

  // randomly return one of the variants
  let option = Math.round(Math.random());
  const res = await fetch(variants[option]);

  // rewrite html and return 
  return rewriter.transform(res);
}
