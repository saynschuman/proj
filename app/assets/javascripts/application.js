// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
//= require trix
//= require turbolinks
//= require_tree .
//= require jquery

(function() {
  $(function() {
    var deleteFile, sendFile;
    document.addEventListener('trix-attachment-add', function(event) {
      var attachment;
      attachment = event.attachment;
      if (attachment.file) {
        return sendFile(attachment);
      }
    });
    document.addEventListener('trix-attachment-remove', function(event) {
      var attachment;
      attachment = event.attachment;
      return deleteFile(attachment);
    });
    sendFile = function(attachment) {
      var file, form, xhr;
      file = attachment.file;
      form = new FormData;
      form.append('Content-Type', file.type);
      form.append('picture[image]', file);
      xhr = new XMLHttpRequest;
      xhr.open('POST', '/pictures', true);
      xhr.upload.onprogress = function(event) {
        var progress;
        progress = void 0;
        progress = event.loaded / event.total * 100;
        return attachment.setUploadProgress(progress);
      };
      xhr.onload = function() {
        var response;
        response = JSON.parse(this.responseText);
        return attachment.setAttributes({
          url: response.url,
          picture_id: response.picture_id,
          href: response.url
        });
      };
      return xhr.send(form);
    };
    deleteFile = function(n) {
      return $.ajax({
        type: 'DELETE',
        url: 'pictures/' + n.attachment.attributes.values.picture_id,
        cache: false,
        contentType: false,
        processData: false
      });
    };
  });

}).call(this);
