/**
 * General functions that are used in the angular module are stored here.
 */

 /** Used to create the HTML alert upon adding a movie to the collection */
var alert = `<div class="alert alert-success alert-dismissible">
                Movie added to your collection!
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;

/** TODO: as is, when there are multiple alerts they act as one and all close at the same time. Find a way around this by making each alert unique */
/**
 * Function used to display the alert when adding a new movie to the collection for 5 seconds.
 */
function displayHint(){
    document.getElementById("alert-container").innerHTML += alert;
    setTimeout(() => {
        $(".alert").alert("close");
    }, 5000);
};

/**
 * Creates and returns a new movie object
 */
function createMovie(){
    var date = new Date();
    return {
        title: isEmpty(document.getElementById("dvd-title").value, 'title'),
        year: isEmpty(document.getElementById("dvd-year").value, 'year'),
        format: document.getElementById("dvd-format").value,
        watched: isEmpty(document.getElementById("times-watched").value, 'watched'),
        rating: null,
        date_added: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
    }
};

/**
 * Check to see if the input values are empty. If not, return the value. If they are, return a defined value of 0 or 'Empty'
 * @param {*} str The value to be checked.
 * @param {*} type The type of input.
 */
function isEmpty(str, type){
    if(!str.trim() == "") {
        return str;
    }
    else {
        if(type === 'watched'){
            return '0';
        }
        else{
            return "Empty";
        }
    }
};