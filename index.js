const path = require('path');
const _ = require('lodash');
const $ = require('config');

// TODO: Error handler

class View {
  setContentType(res, contentType) {
    switch (contentType) {
      case 'liquid':
        contentType = 'application/liquid; charset=utf-8';
        break;
      default:
        contentType = 'text/html; charset=utf-8';
    }

    res.setHeader('Content-Type', contentType);
  }

  marko(res, opt) {
    const template = this.markoTemplate(opt.template);
    return template.render(opt.data, res);
  }

  markoTemplate(templateFile) {
    const ext = '.marko';
    templateFile = path.join($.router.basePath, templateFile);

    if (templateFile.slice(-6) !== ext) {
      templateFile += ext;
    }

    return require(templateFile);
  }
}

const view = new View();

exports.render = function(res, opt) {
  if (_.isUndefined(opt.template)) {
    throw new Error('Missing template parameter.');
  }

  opt.data = opt.data || {};
  opt.engine = opt.engine || 'marko';
  view.setContentType(res, opt.contentType);

  if (opt.engine === 'marko') {
    return view.marko(res, opt);
  }
}
