module.exports = {
  sanitize: (html, config) => {
    if (config && config.ALLOWED_TAGS && config.ALLOWED_TAGS.length === 0) {
      return html.replace(/<[^>]*>?/gm, '');
    }
    return html
      .replace(/<script.*?>.*?<\/script>/gi, '')
      .replace(/<iframe.*?>.*?<\/iframe>/gi, '')
      .replace(/onclick=".*?"/gi, '');
  }
};
