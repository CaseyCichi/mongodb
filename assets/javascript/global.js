
$(document).ready(function() {

  $('.container').hide();

  // run the fetch data function, which will scrape our data
  fetchData();

  // hide these sections before anything else
  $("#seek-box").hide();
  $("#input-area").hide();
  $("#saved-text").hide();
  $("#saved-area").hide();

  $("#seek-box").click(function() {

    populate();

    $('.container').show();

    $("#seek-box").hide();
  });

});

var mongoData;
var dataCount = 0;
var dataDate;

var state = 0;
var cubeRotateAry = ['show-front', 'show-back', 'show-right', 'show-left', 'show-top', 'show-bottom'];
var sideAry = ['back', 'right', 'left', 'top', 'bottom', 'front'];

var populate = function() {

  $.getJSON('/check', function(data) {

    mongoData = data;

    dataDate = mongoData[mongoData.length - 1].date;
  })
  .done(function() {
    clickBox();
    saveNote();
  });
};

var gather = function() {

  var idCount = dataCount - 1;

  $.ajax({
    type: "POST",
    dataType: "json",
    url: '/gather',
    data: {
      id: mongoData[idCount]._id
    }
  })

  .done(function(currentNotes) {
    postNote(currentNotes);
  })

  .fail(function() {
    console.log("Sorry. Server unavailable.");
  });
};

var postNote = function(currentNotes) {

  $("#note-box").val("");

  var note = "";

  for (var i = 0; i < currentNotes.length; i++) {

    note = note + currentNotes[i].noteText + '\n';
  }
  $("#note-box").val(note);
};

var saveNote = function() {

  $("#note-button").on('click', function() {

    var text = $("#input-box").val();

    var idCount = dataCount - 1;

    $.ajax({
      type: "POST",
      dataType: "json",
      url: '/save',
      data: {
        id: mongoData[idCount]._id, // article id
        date: dataDate, // date of article's last update
        note: text // date of note
      }
    })
    .done(function() {

      $("#input-box").val("");

      gather();
    })
    .fail(function() {
      console.log("Sorry. Server unavailable.");
    });

  });
};

var deleteNote = function() {

  // when user clicks delete button
  $("#delete-button").on('click', function() {

    // make the idCount equal the current article
    var idCount = dataCount - 1;

    // send an ajax call to delete
    $.ajax({
      type: "DELETE",
      dataType: "json",
      url: '/delete',
      data: {
        id: mongoData[idCount]._id,
      }
    })
    // with that done, empty the note-box input
    .done(function() {
      $("#note-box").val("");
    })
    // if it fails, tell the user
    .fail(function() {
      console.log("Sorry. Server unavailable.");
    });

  });
};

// This function handles typing animations
var typeIt = function() {
  $("#typewriter-headline").remove();
  $("#typewriter-summary").remove();
  var h = 0;
  var s = 0;
  var newsText;

  if (state > 0) {
    side = state - 1;
  } else {
    side = 5;
  }

  $("." + sideAry[side]).append("<div id='typewriter-headline'></div>");
  $("." + sideAry[side]).append("<div id='typewriter-summary'></div>");

  // cycle to different story
  console.log(mongoData);
  var headline = mongoData[dataCount].headline;
  var summary = mongoData[dataCount].summary;
  dataCount++;
  // type animation for new summary
  (function type() {
    //console.log(newsText);
    printHeadline = headline.slice(0, ++h);
    printSummary = summary.slice(0, ++s);


    // put in the text via javascript
    $("#typewriter-headline").text(printHeadline);
    $("#typewriter-summary").text(printSummary);

    // return stop when text is equal to the writeTxt
    if (printHeadline.length === headline.length && printSummary.length === summary.length) {
      return;
    }
    setTimeout(type, 35);
  }());
};

// render the headline headline
var headline = function() {
  // create the text related to the number of the current article
  var show = "|| Article:" + (dataCount + 1) + " ||";
  // place it in the text box
  $("#headline").text(show);
  // fade the headline in
  $("#headline").fadeIn()
    // and add these style properties to it
    .css({
      position: 'relative',
      'text-align':'center',
      top:100
    })
    .animate({
      position:'relative',
      top: 0
    });
};

// This function handles what happens when the cube is clicked
var clickBox = function() {
  $("#cube").on("click", function() {
    // rotate cycle
    if (state <= 5) {
      state++;
    } else {
      state = 0;
    }
    // add the proper states to the cube based on where it's clicked
    $('#cube').removeClass().addClass(cubeRotateAry[state]);

    //animate headline
    headline();

    //animate text
    typeIt();

    //render notes
    gather();

    //enable delete click listener
    deleteNote();

    //show the note boxes
    $("#input-area").show();
    $("#saved-area").show();
  });
};

// ajax call to do the scrape
var fetchData = function() {
  // call Fetch with AJAX
  $.ajax({
    type: "POST",
    url: '/fetch'
  }).done(function() {
    // show the seek box if it worked
    $("#seek-box").show();
  }).fail(function() {
    // otherwise tell the user an issue has occurred
    alert("Sorry. Server unavailable.");
  });
};
