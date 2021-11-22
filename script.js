const placeholderimg = "resources/placeholder.jpg"
let entrynum;
let currentIndex;
let imgIndex = 1;

$( document ).ready(function() {
    $("#preloader").delay(1500).fadeOut("slow")
    $(document.body).delay(1500).addClass("loaded");


    // Load Popup Contents ------------------------------------------------------------------------------------------- 
    let content = [];
    let date = [];
    let year = [];
    let tags = [];
    let location = [];
    let addresses = [];
    let imagelink = [];
    $.getJSON("./database.json", function(json) {
        let entryLength = Object.values(json).length;
        for (let i = 0; i < entryLength; i++) {
            let entry = Object.values(json);
            content.push(entry[i].content);
            date.push(entry[i].date);
            year.push(entry[i].year);
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
            addAtropos(".atropos");

            let newnum = i+1;
            const entryd = ".entries:nth-of-type("+newnum+") .date";
            const entryr = ".entries:nth-of-type("+newnum+") .year";
            const entryt = ".entries:nth-of-type("+newnum+") .tags";
            const entryl = ".entries:nth-of-type("+newnum+") .location";
            const entrya = ".entries:nth-of-type("+newnum+") .locationlink";

            $(entryd).text(date[i]);
            $(entryr).text(year[i]);
            $(entryt).text(tags[i]);
            $(entryl).text(location[i]);

            if (location[i]===""){ 
                $(".entries:nth-of-type("+newnum+") .location").addClass("hide"); 
            } else {
                $(".entries:nth-of-type("+newnum+") .location").innerText = location[i]; 
            }

            if (addresses[i]===""){ 
                $(entrya).removeAttr("href");
            } else {
                const searchquery = "http://google.com/maps?q=" + addresses[i];
                $(entrya).attr("href", searchquery);
            }
            
            $(".entries:nth-of-type("+newnum+")").removeClass("multiImg")
            if (imagelink[i]===""){ 
                $(".entries:nth-of-type("+newnum+") .imagelink").addClass("hide"); 
                $(".entries:nth-of-type("+newnum+") .imagelink").attr("src", placeholderimg);
            } else { 
                let imgLink = "photos/"+imagelink[i];
                if (Array.isArray(imagelink[i])) { 
                    imgLink = "photos/"+imagelink[i][0]; 
                    $(".entries:nth-of-type("+newnum+")").addClass("multiImg");
                }
                $(".entries:nth-of-type("+newnum+") .imagelink").attr("src", imgLink); 
                $(".entries:nth-of-type("+newnum+") .imagelink").removeClass("hide"); 
            }

            // Read More -------------------------------------------------------------------------------------------
            $(".entries:nth-of-type("+newnum+")").click(() => {
                document.querySelectorAll('.successiveImgs').forEach(e => e.remove());
                $(".date2").text(date[i]);
                $(".content").text(content[i]);
                $(".loc").text(location[i]); 
                if(content[i]===""){
                    $(".content").css({"display":"none"});
                } else {
                    $(".content").css({"display":"block"});
                    $(".content").html(content[i]);
                    if($(".content").height() >= $(".content_container").height()) { $(".content").addClass("overflown")} 
                    else { $(".content").removeClass("overflown")}
                }
                if (imagelink[i]===""){ 
                    $(".imagelink2").attr("src", placeholderimg);
                } else { 
                    imgIndex = 1;
                    let imgLink = "photos/"+imagelink[i];
                    if(Array.isArray(imagelink[i])) { 
                        $(".fa-chevron-left").addClass("noArrow");
                        $(".fa-chevron-right").removeClass("noArrow");
                        imgLink = "photos/"+imagelink[i][0]; 
                        $(".imageNav").removeClass("disabled") 
                    } else { $(".imageNav").addClass("disabled") }
                    $(".imagelink2").attr("src", imgLink);
                    $(".imagelink2").removeClass("hide")
                }
                currentIndex = i;
                $("#entrydetails").addClass("show");
                dim();
            })
            $(".close").click(() => { $("#entrydetails").removeClass("show"); dim();})
        }
        $(".entries").last().css({"display":"none"});
        $(".entries:nth-of-type("+(entryLength)+")").css({"display":"none"}); // Removes placeholder
    });


    // Multiple Images ------------------------------------------------------------------------------------

    $(".fa-chevron-left").on("click", function() { navigatePhotos("left"); })
    $(".fa-chevron-right").on("click", function() { navigatePhotos("right"); })

    function navigatePhotos(direction) {
        $(".fa-chevron-right").removeClass("noArrow");
        if (direction === "right"){ //moving right
            if(imgIndex < (imagelink[currentIndex].length)){ imgIndex += 1; }
        } else { //moving left
            if(imgIndex > 1){ imgIndex -= 1; }
        } 

        if(imgIndex === (imagelink[currentIndex].length)){ $(".fa-chevron-right").addClass("noArrow"); }
        if(imgIndex === 1) { $(".fa-chevron-left").addClass("noArrow"); } 
        else { $(".fa-chevron-left").removeClass("noArrow"); }

        let currentImg = "photos/"+imagelink[currentIndex][imgIndex-1];
        $(".imagelink2").attr("src", currentImg);
    }

    function dim() {
        if($("#entrydetails").hasClass("show")){ $("header, #hero, nav, #articleGrid, footer").addClass("dim"); } 
        else { $("header, #hero, nav, #articleGrid, footer").removeClass("dim"); }
    }


    // Hero -------------------------------------------------------------------------------------------
    dayglow(); // Depending on time of day, change from darker image to lighter
    function dayglow() {
        var currentTime = new Date().getHours();
        if ((6 <= currentTime && currentTime < 18 )) { //if between 6am and 6pm
            $("#hero").attr("src", "resources/heroes/day1.jpg");
            $("body").removeClass("nighttime");
        } else {
            let nightImages = [
                "resources/heroes/night1.jpg",
                "resources/heroes/night2.jpg"
            ]
            let hero = nightImages[Math.floor(Math.random()*nightImages.length)];
            $("#hero").attr("src", hero);
            $("body").addClass("nighttime");
        }
    }  

    var blurOnScroll = function(evt) {
        if ($(this).scrollTop() > 0) {
            let calcBlur = "blur("+ (($(this).scrollTop()**1.4)/5000) +"rem)";
            let calcOpacity = (300-$(this).scrollTop())/400 + "";
            $("#hero").css({
                "filter":calcBlur,
                "opacity":calcOpacity
            });
            
        } else { $("#hero").css({
            "filter":"none",
            "opacity":"0.8"
        }); }
    };
    window.addEventListener("scroll", blurOnScroll);

    
    // Date Tags -------------------------------------------------------------------------------------------
    $("nav span").on("click", function() {
        $("#badsearch").addClass("hidden");
        $("nav span").removeClass("show");
        $(this).toggleClass("show"); 
        for (let i = 0; i < entrynum; i++) {
            const matchYear = $(".entries:nth-of-type("+i+") .year").text();
            if(matchYear === $(this).text()) { $(".entries:nth-of-type("+i+")").removeClass("hidden");
            } else { $(".entries:nth-of-type("+i+")").addClass("hidden"); }
        }
        if ($(this).text() === "All") {
            for (let i = 0; i < entrynum; i++){ $(".entries:nth-of-type("+i+")").removeClass("hidden"); }
        }
    })


    // Search -------------------------------------------------------------------------------------------
    $( "#search" ).change(function() {
        $("#badsearch").addClass("hidden");
        let inputTag = $("#search").val(); 
        if(!/\S/.test(inputTag)) { // when a whitespace character is searched
            for (let i = 0; i < entrynum; i++) { // show all entries
                $(".entries:nth-of-type("+i+")").removeClass("hidden");
            }
         } else {
            for (let i = 0; i < entrynum; i++) {
                const matchTag = $(".entries:nth-of-type("+i+") .tags").text();
                let tagTest = inputTag.toLowerCase();
                tagTest = tagTest.replace(/\s+/g, '');
                if(matchTag.indexOf(tagTest) >= 0) { 
                    $(".entries:nth-of-type("+i+")").removeClass("hidden");
                } else { 
                    $(".entries:nth-of-type("+i+")").addClass("hidden");
                }
            }
            if(($(".entries").length - 2) === $(".entries.hidden").length) { // When search term can't be found
                $("#badsearch").removeClass("hidden");
                $("#badsearch span").html(inputTag);
            } else {
                $("#badsearch").addClass("hidden");
            }
        }
    });


    // Audio -------------------------------------------------------------------------------------------
    $("audio")[0].volume = 0.03; //0.15 for Novo
    $("#audiogroup").click(() => { 
        $("#audiogroup").toggleClass("soundoff");
        if ($("audio")[0].paused == false) {
            $("audio")[0].pause();
        } else {
            $("audio")[0].play();
        }
    })


    /* Atropos ------------------------------------------------------------------------------------------ */
    function addAtropos(element) {
        document.querySelectorAll(element).forEach((e) => {
            Atropos({ el: e, highlight: false, rotateTouch: "scroll-y" });
        });
    }
    
    
    /* Upcoming -------------------------------------------------------------------------------------------
    •  Upload Movies
    •  Embed songs + videos
    */
});
