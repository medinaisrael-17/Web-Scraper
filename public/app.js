$.getJSON("/articles", function (data) {
    console.log(data)
    for (var i = 0; i < data.length; i++) {
        $("#articles").append(`
        <div id = "articleCard" class = "card"> 
        <h5 class="card-title"> ${data[i].title} </h5>
        <hr>
        <p>Article Link: <a href = "${data[i].link}" target = "_blank"> ${data[i].link} </a> </p>
        <button data-id = ${data[i]._id} class="btn btn-primary" id = "noteButton"> Make A Note </button>
        `)
    }
});

$(document).on("click", "button", function () {
    $("#notes").empty();

    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<h2>" + data.title + "</h2>");
            // An input to enter a new title
            $("#notes").append(`<div class="input-group input-group-sm mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Title</span>
                                    </div>
                                    <input id ="titleinput" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
                                </div>`);
            // A textarea to add a new note body
            $("#notes").append(`<div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Text</span>
                                    </div>
                                    <textarea id="bodyinput" class="form-control" aria-label="With textarea"></textarea>
                                </div>`);
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append(`<button data-id=${data._id} class ="btn btn-secondary" id="savenote">Save Note</button>`);

            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        })
});

$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });