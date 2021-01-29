const placeholderimg = "resources/placeholder.jpg"

$( document ).ready(function() {
    document.body.className += ' loaded';

    // Load Popup Contents ------------------------------------------------------------------------------------------- 
    let content = [];
    let date = [];
    let tags = [];
    let location = [];
    let addresses = []; //<<<<< Not used yet
    let imagelink = [];
    $.getJSON("./database.json", function(json) {
        let entryLength = Object.values(json).length;
        for (let i = 0; i < entryLength; i++) {
            let entry = Object.values(json);
            content.push(entry[i].content);
            date.push(entry[i].date);
            tags.push(entry[i].tags);
            location.push(entry[i].location);
            addresses.push(entry[i].address);
            imagelink.push(entry[i].imagelink);
        }
        entrynum = Object.values(json).length;

        // Making entries ---------------------------------------------------------------------------------------------
        for (let i = 0; i < entryLength; i++) {
            const entry = document.getElementById("entry1");
            const newentry = entry.cloneNode(true);
            newentry.id = "entry" + (i+2);
            document.getElementById("articleGrid").appendChild(newentry);
            
            let newnum = i+1;
            const entryd = ".entries:nth-of-type("+newnum+") .date";
            const entryt = ".entries:nth-of-type("+newnum+") .tags";
            const entryl = ".entries:nth-of-type("+newnum+") .location";

            $(entryd).text(date[i]);
            $(entryt).text(tags[i]);
            $(entryl).text(location[i]);

            if (location[i]===""){ 
                $(".entries:nth-of-type("+newnum+") .location").addClass("hide"); 
            } else {
                $(".entries:nth-of-type("+newnum+") .location").innerText = location[i]; 
            }
            
            if (imagelink[i]===""){ 
                $(".entries:nth-of-type("+newnum+") .imagelink").addClass("hide"); 
                $(".entries:nth-of-type("+newnum+") .imagelink").attr("src", placeholderimg);
            } else { 
                $(".entries:nth-of-type("+newnum+") .imagelink").attr("src", imagelink[i]); 
                $(".entries:nth-of-type("+newnum+") .imagelink").removeClass("hide") 
            }
            
            // Read More -------------------------------------------------------------------------------------------
            $(".entries:nth-of-type("+newnum+")").click(() => {
                $(".date2").text(date[i]);
                $(".content").text(content[i]);
                $(".loc").text(location[i]); 
                if(content[i]===""){
                    $(".content").css({"display":"none"});
                } else {
                    $(".content").css({"display":"block"});
                    $(".content").text(content[i]);
                }
                if (imagelink[i]===""){ 
                    $(".imagelink2").attr("src", placeholderimg);
                } else { 
                    $(".imagelink2").attr("src", imagelink[i]);
                    $(".imagelink2").removeClass("hide") 
                }
                $("#entrydetails").addClass("show");
                dim();
            })
            $(".close").click(() => { $("#entrydetails").removeClass("show"); dim();})
        }
        $(".entries").last().css({"display":"none"});
    });

    function dim() {
        if($("#entrydetails").hasClass("show")){
            $("header, #articleGrid, footer").addClass("dim");
        } else {
            $("header, #articleGrid, footer").removeClass("dim");
        }
    }

    // Dayglow -------------------------------------------------------------------------------------------
    dayglow(); // Depending on time of day, change from darker image to lighter
    function dayglow() {
        var currentTime = new Date().getHours();
        if ((6 <= currentTime&&currentTime < 18 )) { //if between 6am and 6pm
            $("#hero").attr("src", "resources/heroes/day1.jpg");
        } else {
            $("#hero").attr("src", "resources/heroes/night1.jpg");
        }
    }  

    // Tags -------------------------------------------------------------------------------------------
});
