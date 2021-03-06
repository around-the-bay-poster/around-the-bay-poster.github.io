$(function() {
  var $image = $(".cropper"),
      $dataX = $("#dataX"),
      $dataY = $("#dataY"),
      $dataHeight = $("#dataHeight"),
      $dataWidth = $("#dataWidth"),
      console = window.console || {log:$.noop},
      cropper;

  $image.cropper({
    aspectRatio: 316 / 172,
    autoCropArea: 1,
    //data: {
    //  x: 420,
    //  y: 50,
    //  width: 640,
    //  height: 360
    //},
    preview: ".preview",

    //strict: false,
    //guides: false,
    //highlight: false,
    dragCrop: false,
    movable: false,
    resizable: false,

    // multiple: true,
    // autoCrop: false,
    // dragCrop: false,
    // dashed: false,
    // modal: false,
    // movable: false,
    // resizable: false,
    // zoomable: false,
    // rotatable: false,
    // checkImageOrigin: false,

    // maxWidth: 480,
    // maxHeight: 270,
    // minWidth: 160, // minHeight: 90,

    done: function(data) {
      $dataX.val(data.x);
      $dataY.val(data.y);
      $dataHeight.val(data.height);
      $dataWidth.val(data.width);
    },

    build: function(e) {
      console.log(e.type);
    },

    built: function(e) {
      console.log(e.type);
    },

  });

  $image.on("built.cropper", function() {
    $("#preview").show();
  });

  cropper = $image.data("cropper");

  $("#zoom").click(function() {
    $image.cropper("zoom", $("#zoomWith").val());
  });

  $("#zoomIn").click(function() {
    $image.cropper("zoom", 0.1);
  });

  $("#zoomOut").click(function() {
    $image.cropper("zoom", -0.1);
  });

  var $inputImage = $("#inputImage");

  if (window.FileReader) {
    $inputImage.change(function() {
      var fileReader = new FileReader(),
          files = this.files,
          file;

      if (!files.length) {
        return;
      }

      file = files[0];

      if (/^image\/\w+$/.test(file.type)) {
        fileReader.readAsDataURL(file);
        fileReader.onload = function () {
          $image.cropper("reset", true).cropper("replace", this.result);
          $inputImage.val("");
        };
        fileReader.onloadend = function () {
          $.smoothScroll({
            scrollTarget: '#step-2',
          });
        };
      } else {
        showMessage("Please choose an image file.");
      }
    });
  } else {
    $inputImage.addClass("hide");
  }

  $("#setAspectRatio").click(function() {
    $image.cropper("setAspectRatio", $("#aspectRatio").val());
  });

  $("#downloadPdf").click(function() {
    var doc = createPoster();
    doc.save('AroundTheBayPoster.pdf');
  });

  $("#startOver").click(function() {
    $.smoothScroll({
      scrollTarget: '#header',
    });
  });

  createPoster = function() {
    var dataURL = $image.cropper("getDataURL", "image/jpeg", 1);
    var posterTemplateDataURL = getImageDataURL($(".poster-template img")[0])
    var posterHeaderDataURL = getImageDataURL($(".poster-template img")[1])
    var posterRedTriangleDataURL = getImageDataURL($(".poster-template img")[2])
    var posterFooterDataURL = getImageDataURL($(".poster-template img")[3])
    var posterTemplateDataURL = getImageDataURL($(".poster-template img")[4])
    var doc = new jsPDF('portrait', 'mm', 'a3');
    doc.addImage(posterTemplateDataURL, 'JPEG', 0, 0, 297, 420);
    //doc.addImage(posterHeaderDataURL, 'JPEG', 0, 0, 297, 66);
    //doc.addImage(posterRedTriangleDataURL, 'JPEG', 0, 66, 297, 47);
    doc.addImage(dataURL, 'JPEG', 77, 112, 144, 141);
    //doc.addImage(posterFooterDataURL, 'JPEG', 0, 269, 297, 151);

    printRiderName(doc);
    printRiderDistance(doc);
    printRiderGoal(doc);

    // Optional - set properties on the document
    doc.setProperties({
      title: 'Around the bay - NAME?',
      subject: 'Helping the Smith Family',
      author: 'James Hall',
      keywords: 'generated, javascript, web 2.0, ajax',
      creator: 'NAME?'
    });
    return doc;
  };

  function printRiderName(doc) {
    var nameLine1 = $("#riderName")[0].value || "<your name>";
    doc.setFontSize(38);
    doc.setFont("helvetica");
    doc.setTextColor(255,255,255);
    doc.myText(nameLine1,{align: "center"},0,82);
    doc.myText("is riding for a child in need",{align: "center"},0,99);
  };

  function printRiderDistance(doc) {
    var distanceLine1 = "Sponsor me to get into my lycra and pedal ";
    var distanceLine2 = " in the Around the Bay bike ride";
    var distanceLine3 = "on Sunday 11th October to support the Smith Family.";
    doc.setFontSize(20);
    doc.setFont("helvetica");
    doc.setTextColor(0,0,0);
    doc.myText(distanceLine1 + $("#riderDistance")[0].value + distanceLine2,{align: "center"},0,271);
    doc.myText(distanceLine3,{align: "center"},0,281);
  }

  function printRiderGoal(doc) {
    var goalLine1 = "My goal is to raise $";
    var goalLine2 = $("#riderFundraisingGoal")[0].value || "<your goal>"
    doc.setFontSize(32);
    doc.setFont("helvetica");
    doc.setTextColor(255,255,255);
    doc.text(78,299,goalLine1 + goalLine2,{align: "center"});
  }

  function getImageDataURL(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      // Copy the image contents to the canvas
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      // Get the data-URL formatted image
      return dataURL = canvas.toDataURL("image/jpeg");
  };

});
