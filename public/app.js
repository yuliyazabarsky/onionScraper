$("#home").on("click", function(){
    $.ajax({
        method: "GET",
        url:"/"

    }).then(function(results){
        $("#articles").empty();
    })
})


$.getJSON("/articles", function(data){
    $("#articles").empty();

    for (var i=0; i<data.length; i++){

        var title = data[i].title;
        var link= data[i].link;

        $("#articles").append(
            // $('<div class="col-sm">').append(
            // $('<div class="card">').append(
        $("<h5 class='class-title'>").text(title),
        $("<a class='btn btn-warning'>").text("Read Article").attr("href", link).attr("target", '_blank'), $("<a class='btn btn-warning' id='savearticle'>").text("Save Article").attr("href", "/savearticle") )
        

        // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br /" + data[i].link + "</p>";
    }
});

$(document).on("click", "p", function(){
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    //Now make an ajax call for the Article 
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).then(function(data){
        console.log(data);

        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title'>");
        $("#notes").append("<textarea id ='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "'id='savenote'>Save Note</button>");
        //if there is a note in the article 
        if(data.note){
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
});

$(document).on("click", "#savearticle", function(){
    var thisId = $(this).attr("data-id");

    //POST request 

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: title
        // data:{
        //     title: $("#titleinput").val(),
        //     body: $("#bodyinput").val()
        // }
    }).then(function(data){
        console.log(data);
        $("#notes").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});