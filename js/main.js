//CONST
var USERS_SRC = "https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture";
var TIME_OUT = 15000;


/** 
 * Class UserStorage - load,render,sort the userlist
 * 
 * @param string url - link  
 */
function UserStorage(url)
{
    this.url = url;
    this.userList = [];
    this.sortMethod = 'ASC';
    this.sortType = 'byFirstLetter';
}

/** 
 * UserStorage method - for load user data from url
 * 
 */
UserStorage.prototype.init = function() 
{
    // save context storage
    var context = this;
    //
    var xhr = new XMLHttpRequest();
    var url = this.url;
    xhr.open('GET', url, true);
    xhr.timeout = TIME_OUT;
    xhr.ontimeout = function()
    {
        console.log('Time is up. Load fail.');
        var container = document.getElementById('container');
        container.innerHTML = '<h1 class="error"> User data don`t loaded, please press F5 for reload the page</>';
    }
    xhr.send();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var loadResults = JSON.parse(xhr.responseText);
                context.addToStorage(loadResults);
            }
        }
    }
}

/** 
 * UserStorage method - create objects "User" for each item and push them into class property (array of objects)
 * 
 * @param array results 
 */
UserStorage.prototype.addToStorage = function(results)
{
    this.userList = [];
    var uList = this.userList;
    results['results'].forEach(function(item,index) 
    {
        var usr = new User(
            index,
            item.gender,
            item.email,
            item.location.city,
            item.location.postcode,
            item.location.state,
            item.location.street,
            item.name.title,
            item.name.first,
            item.name.last,
            item.phone,
            item.picture.thumbnail,
            item.picture.medium,
            item.picture.large
        );
        uList.push(usr);
    });
    this.renderList();
}

/**
 * UserStorage method - render user list
 */
UserStorage.prototype.renderList = function()
{
    var DOM_userList = document.getElementById('userList');
    // save context UserStorage
    var context = this;

    // add event click on list item
    DOM_userList.addEventListener('click',function(){
        context.prepareOpenCard(event);
    }); 

    // render list
    this.userList.forEach(function(item,index,array)
    {
        // create DOM elements
        var DOM_item = document.createElement('div');
        var DOM_picture = document.createElement('img');
        var DOM_title = document.createElement('div');
        var DOM_fName = document.createElement('div');
        var DOM_lName = document.createElement('div');
        // get data from User object
        var picture = item.mediumPic;
        var title = item.title;
        var fName = item.fName;
        var lName = item.lName;
        var id = item.id;
        // add class for DOM elements
        DOM_item.classList.add('listItem');
        DOM_picture.classList.add('listItem__picture');
        DOM_title.classList.add('listItem__title');
        DOM_fName.classList.add('listItem__fName');
        DOM_lName.classList.add('listItem__lName');
        // set data in DOM element        
        DOM_item.dataset.id = id;
        DOM_picture.src = picture;
        DOM_title.innerHTML = title;
        DOM_fName.innerHTML = fName;
        DOM_lName.innerHTML = lName;
        // create DOM structure
        DOM_userList.appendChild(DOM_item);
        DOM_item.appendChild(DOM_picture);
        DOM_item.appendChild(DOM_title);
        DOM_item.appendChild(DOM_fName);
        DOM_item.appendChild(DOM_lName);
    })
}

/**
 * UserStorage method - prepare data and call User class method renderCard
 */
UserStorage.prototype.prepareOpenCard = function(event)
{
    var target = event.target;
    var DOM_class = target.className;

    //find parent container with dataset.id
    while(DOM_class != 'userList'){
        if(DOM_class == 'listItem'){
            var user = this.userList[target.dataset.id]
            user.renderCard();
            return;
        }
        target = target.parentNode;
        DOM_class = target.className;
    }
    
}

/** 
 * Class User - render userCard
 * 
 * @param int id 
 * @param string gender 
 * @param string email 
 * @param string city 
 * @param string postcode 
 * @param string state 
 * @param string street 
 * @param string title 
 * @param string fName 
 * @param string lName 
 * @param string phone 
 * @param string smallPic 
 * @param string mediumPic 
 * @param string largePic 
 */
function User(id,gender,email,city,postcode,state,street,title,fName,lName,phone,smallPic,mediumPic,largePic)
{
    this.id = id;
    this.gender = gender;
    this.email = email;
    this.city = city;
    this.postcode = postcode;
    this.state = state;
    this.street = street;
    this.title = title;
    this.fName = fName;
    this.lName = lName;
    this.phone = phone;
    this.smallPic = smallPic;
    this.mediumPic = mediumPic;
    this.largePic = largePic;
}

/**
 * User method - render user card
 * 
 */
User.prototype.renderCard = function()
{
    console.log(this.gender);
    //create DOM elements

}

// init Storage
var uStorage = new UserStorage(USERS_SRC);
uStorage.init();

