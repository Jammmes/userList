
/** 
 * Class UserStorage - load,render,sort the userlist
 * 
 */
function UserStorage()
{
    this.url = "https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture";
    this.timeout = 15000;
    this.userList = [];
    this.sortMethod = 'ASC';
}

/** 
 * UserStorage.init - prepare storage, add events on DOM elements
 * 
 */
UserStorage.prototype.init = function() 
{
    // sort settings
    this.prepareSort();
    // load and save user list
    this.getUserList();

    // find DOM elements
    var DOM_userList = document.getElementById('userList');
    var DOM_wrap = document.getElementById('wrap');

    
    // add event click on list item for open user card
    var context = this;
    DOM_userList.addEventListener('click',function(){
        context.openCard(event);
    }); 
    // add event click on wrap for delete card and hide wrap
    DOM_wrap.addEventListener("click",function(){
        var DOM_userCard = document.getElementById('userCard');
        this.style.display = "none";
        if(DOM_userCard){
            DOM_userCard.remove();
        }
    });
}

/**
 * UserStorage.getUserList - load and save user list
 */
UserStorage.prototype.getUserList = function()
{
    // save context storage
    var context = this;
    //
    var xhr = new XMLHttpRequest();
    var url = this.url;
    xhr.open('GET', url, true);
    xhr.timeout = this.timeout;
    xhr.ontimeout = function()
    {
        var DOM_container = document.getElementById('container');
        DOM_container.innerHTML = '<h1 class="error"> User data don`t loaded, please press F5 for reload the page</>';
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
 * UserStorage.addToSorage - create objects "User" for each list item and push them into UserStorage.userList (array of objects)
 * 
 * @param array results - result loading data from url
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
 * UserStorage.renderList - render user list
 */
UserStorage.prototype.renderList = function()
{
    var DOM_userList = document.getElementById('userList');
    // clean old data
    DOM_userList.innerHTML = "";

    // sort user list
    this.sortUserList();

    // render list
    this.userList.forEach(function(item)
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
        // add classes to DOM elements
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
 * UserStorage.prepareSort - set event on selector for sorting user list
 */
UserStorage.prototype.prepareSort = function ()
{
    var rb_ASC = document.getElementById('ASC');
    var rb_DESC= document.getElementById('DESC');

    var context = this;
    rb_ASC.addEventListener("change",function(){
        context.newSort(event);
    });
    rb_DESC.addEventListener("change",function(){
        context.newSort(event);
    });
}

/**
 * UserStorage.newSort - change sort method and re-render user list 
 */
UserStorage.prototype.newSort = function(event)
{
    this.sortMethod = event.target.value;
    this.renderList();
}

/**
 * UserStorage.sortUserList - sort userList
 */
UserStorage.prototype.sortUserList = function()
{
    function compare(a,b)
    {
        if(a.fName > b.fName){
            return 1
        };
        if (a.fName < b.fName){
            return -1
        };
        return 0;
    };

    this.userList.sort(compare);

    if (this.sortMethod === 'DESC'){
        this.userList.reverse();
    }
}

/**
 * UserStorage.openCard - prepare data and call User class method renderCard
 */
UserStorage.prototype.openCard = function(event)
{
    var target = event.target;
    var DOM_class = target.className;

    //find parent container wich contain "dataset.id" and then call render card
    while(DOM_class != 'userList'){
        if(DOM_class == 'listItem'){
            var user = this.getUserbyId(target.dataset.id);
            user.renderCard();
            return;
        }
        target = target.parentNode;
        DOM_class = target.className;
    }
}

/**
 * UserStorage.getUserById - return object User from userList by ID
 * 
 * @param int id 
 */
UserStorage.prototype.getUserbyId = function(id)
{
    function isEqual(item){
        if (parseInt(item.id) === parseInt(id)){
            return true
        }
    }

    var elem = this.userList.find(isEqual);
    return elem;
}

/** 
 * Class User - save user data and render userCard
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
 * User.renderCard - render user card
 * 
 */
User.prototype.renderCard = function()
{
    // find some DOM elements
    var DOM_mainContainer = document.getElementById('container');
    var DOM_wrap = document.getElementById('wrap');
    //create DOM elements
    var DOM_userCard = document.createElement('div');

    var DOM_cardBlock_img = document.createElement('div');
    var DOM_value_img = document.createElement('img');

    var DOM_cardBlock_id = document.createElement('div');
    var DOM_caption_id  = document.createElement('div');
    var DOM_value_id  = document.createElement('div');

    var DOM_cardBlock_common_name = document.createElement('div');
    var DOM_caption_name = document.createElement('div');
    var DOM_cardBlock_clear = document.createElement('div');
    var DOM_value_title = document.createElement('div');
    var DOM_value_fName = document.createElement('div');
    var DOM_value_lName = document.createElement('div');

    var DOM_cardBlock_street = document.createElement('div');
    var DOM_caption_street = document.createElement('div');
    var DOM_value_street = document.createElement('div');

    var DOM_cardBlock_city = document.createElement('div');
    var DOM_caption_city = document.createElement('div');
    var DOM_value_city = document.createElement('div');

    var DOM_cardBlock_state = document.createElement('div');
    var DOM_caption_state = document.createElement('div');
    var DOM_value_state = document.createElement('div');

    var DOM_cardBlock_postcode = document.createElement('div');
    var DOM_caption_postcode = document.createElement('div');
    var DOM_value_postcode = document.createElement('div');

    var DOM_cardBlock_email = document.createElement('div');
    var DOM_caption_email = document.createElement('div');
    var DOM_value_email = document.createElement('div');

    var DOM_cardBlock_phone = document.createElement('div');
    var DOM_caption_phone = document.createElement('div');
    var DOM_value_phone = document.createElement('div');
    
    // add classes/id to DOM elements
    DOM_userCard.classList.add('userCard');
    DOM_userCard.setAttribute('id','userCard');

    DOM_cardBlock_img.classList.add('cardBlock');
    DOM_cardBlock_id.classList.add('cardBlock');
    DOM_cardBlock_common_name.classList.add('cardBlock');
    DOM_cardBlock_clear.classList.add('cardBlock_clear');
    DOM_cardBlock_city.classList.add('cardBlock');
    DOM_cardBlock_street.classList.add('cardBlock');
    DOM_cardBlock_state.classList.add('cardBlock');
    DOM_cardBlock_postcode.classList.add('cardBlock');
    DOM_cardBlock_email.classList.add('cardBlock');
    DOM_cardBlock_phone.classList.add('cardBlock');

    DOM_caption_id.classList.add('cardBlock__caption');
    DOM_caption_name.classList.add('cardBlock__caption');
    DOM_caption_city.classList.add('cardBlock__caption');
    DOM_caption_street.classList.add('cardBlock__caption');
    DOM_caption_state.classList.add('cardBlock__caption');
    DOM_caption_postcode.classList.add('cardBlock__caption');
    DOM_caption_email.classList.add('cardBlock__caption');
    DOM_caption_phone.classList.add('cardBlock__caption');

    DOM_value_img.classList.add('cardBlock__value');
    DOM_value_id.classList.add('cardBlock__value');
    DOM_value_title.classList.add('cardBlock__value');
    DOM_value_fName.classList.add('cardBlock__value');
    DOM_value_lName.classList.add('cardBlock__value');
    DOM_value_city.classList.add('cardBlock__value');
    DOM_value_street.classList.add('cardBlock__value');
    DOM_value_state.classList.add('cardBlock__value');
    DOM_value_postcode.classList.add('cardBlock__value');
    DOM_value_email.classList.add('cardBlock__value');
    DOM_value_phone.classList.add('cardBlock__value');
    // set data in DOM elements
    DOM_caption_id.innerHTML = "ID: ";
    DOM_caption_name.innerHTML = "NAME: ";
    DOM_caption_city.innerHTML = "CITY: ";
    DOM_caption_street.innerHTML = "STREET: ";
    DOM_caption_state.innerHTML = "STATE: ";
    DOM_caption_postcode.innerHTML = "POSTCODE: ";
    DOM_caption_email.innerHTML = "EMAIL: ";
    DOM_caption_phone.innerHTML = "PHONE: ";

    DOM_value_img.src = this.largePic;
    DOM_value_id.innerHTML = this.id;
    DOM_value_title.innerHTML = this.title;
    DOM_value_fName.innerHTML = this.fName;
    DOM_value_lName.innerHTML = this.lName;
    DOM_value_city.innerHTML = this.city;
    DOM_value_street.innerHTML = this.street;
    DOM_value_state.innerHTML = this.state;
    DOM_value_postcode.innerHTML = this.postcode;
    DOM_value_email.innerHTML = this.email;
    DOM_value_phone.innerHTML = this.phone;
    //create DOM structure
    DOM_mainContainer.appendChild(DOM_userCard);

    DOM_userCard.appendChild(DOM_cardBlock_img);
    DOM_userCard.appendChild(DOM_cardBlock_id);
    DOM_userCard.appendChild(DOM_cardBlock_common_name);
    DOM_userCard.appendChild(DOM_cardBlock_street);
    DOM_userCard.appendChild(DOM_cardBlock_city);
    DOM_userCard.appendChild(DOM_cardBlock_state);
    DOM_userCard.appendChild(DOM_cardBlock_postcode);
    DOM_userCard.appendChild(DOM_cardBlock_email);
    DOM_userCard.appendChild(DOM_cardBlock_phone);

    DOM_cardBlock_img.appendChild(DOM_value_img);

    DOM_cardBlock_id.appendChild(DOM_caption_id);
    DOM_cardBlock_id.appendChild(DOM_value_id);

    DOM_cardBlock_common_name.appendChild(DOM_caption_name);
    DOM_cardBlock_common_name.appendChild(DOM_cardBlock_clear);
    DOM_cardBlock_clear.appendChild(DOM_value_title);
    DOM_cardBlock_clear.appendChild(DOM_value_fName);
    DOM_cardBlock_clear.appendChild(DOM_value_lName);

    DOM_cardBlock_street.appendChild(DOM_caption_street);
    DOM_cardBlock_street.appendChild(DOM_value_street);

    DOM_cardBlock_city.appendChild(DOM_caption_city);
    DOM_cardBlock_city.appendChild(DOM_value_city);

    DOM_cardBlock_state.appendChild(DOM_caption_state);
    DOM_cardBlock_state.appendChild(DOM_value_state);

    DOM_cardBlock_postcode.appendChild(DOM_caption_postcode);
    DOM_cardBlock_postcode.appendChild(DOM_value_postcode);

    DOM_cardBlock_email.appendChild(DOM_caption_email);
    DOM_cardBlock_email.appendChild(DOM_value_email);

    DOM_cardBlock_phone.appendChild(DOM_caption_phone);
    DOM_cardBlock_phone.appendChild(DOM_value_phone);

    // setting modal view user card
    DOM_wrap.style.display = "block";
}

// init Storage
var uStorage = new UserStorage();
uStorage.init();   