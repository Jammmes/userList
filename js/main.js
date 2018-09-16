
/** 
 * Class UserStorage - load,render,sort the userlist
 * 
 */
function UserStorage() {
    this.url = "https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture";
    this.timeout = 15000;
    this.userList = [];
    this.sortMethod = 'ASC';
    this.userModel = {
        'id' : 0, 
        'gender' : '', 
        'email' : '', 
        'city' : '', 
        'postcode' : '', 
        'state' : '', 
        'street' : '', 
        'title' : '', 
        'fName' : '', 
        'lName' : '', 
        'phone' : '', 
        'smallPic' : '', 
        'mediumPic' : '', 
        'largePic' : '', 
    };
}

/** 
 * UserStorage.init - prepare storage, add events on DOM elements
 * 
 */
UserStorage.prototype.init = function() {
    // sort settings
    this.prepareSort();
    // load and save user list
    this.getUserList();

    // find DOM elements
    var userList = document.getElementById('userList');
    var wrap = document.getElementById('wrap');

    // add event click on list item for open user card
    var openCard = this.openCard;

    userList.addEventListener('click',function() {
       openCard(event);
    }); 
    // add event click on wrap for delete card and hide wrap
    wrap.addEventListener("click",function() {
        var userCard = document.getElementById('userCard');
        this.style.display = "none";
        if(userCard){
            userCard.remove();
        }
    });
}

/**
 * UserStorage.getUserList - load and save user list
 */
UserStorage.prototype.getUserList = function() {
    // save method storage
    var addToStorage = this.addToStorage;
    //
    var xhr = new XMLHttpRequest();
    var url = this.url;
    xhr.open('GET', url, true);
    xhr.timeout = this.timeout;
    xhr.ontimeout = function()
    {
        var container = document.getElementById('container');
        container.innerHTML = '<h1 class="error"> User data don`t loaded, please press F5 for reload the page</>';
    }
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var loadResults = JSON.parse(xhr.responseText);
               addToStorage(loadResults);
            }
        }
    }
}

/** 
 * UserStorage.addToSorage - create objects "User" for each list item and push them into UserStorage.userList (array of objects)
 * 
 * @param array results - result loading data from url
 */
UserStorage.prototype.addToStorage = function(results) {
    this.userList = [];
    var userModel = this.userModel
    var uList = this.userList;
    results['results'].forEach(function(item,index) {
        
        userModel.id = index,
        userModel.gender = item.gender,
        userModel.email = item.email,
        userModel.city = item.location.city,
        userModel.postcode = item.location.postcode,
        userModel.state = item.location.state,
        userModel.street = item.location.street,
        userModel.title = item.name.title,
        userModel.fName = item.name.first,
        userModel.lName = item.name.last,
        userModel.phone = item.phone,
        userModel.smallPic = item.picture.thumbnail,
        userModel.mediumPic = item.picture.medium,
        userModel.largePic = item.picture.large;
        
        var usr = new User(userModel);
        uList.push(usr);
    });
    this.renderList();
}

/**
 * UserStorage.renderList - render user list
 */
UserStorage.prototype.renderList = function() {
    var userList = document.getElementById('userList');
    // clean old data
    userList.innerHTML = "";

    // sort user list
    this.sortUserList();

    // render list
    this.userList.forEach(function(user)
    {
        // create DOM elements
        var item = document.createElement('div');
        var picture = document.createElement('img');
        var title = document.createElement('div');
        var fName = document.createElement('div');
        var lName = document.createElement('div');
        // add classes to DOM elements
        item.classList.add('listItem');
        picture.classList.add('listItem__picture');
        title.classList.add('listItem__title');
        fName.classList.add('listItem__fName');
        lName.classList.add('listItem__lName');
        // set data in DOM element        
        item.dataset.id = user.id;
        picture.src = user.mediumPic;
        title.innerHTML = user.title;
        fName.innerHTML = user.fName;
        lName.innerHTML = user.isEquallName;
        // create DOM structure
        userList.appendChild(item);
        item.appendChild(picture);
        item.appendChild(title);
        item.appendChild(fName);
        item.appendChild(lName);
    })
}

/**
 * UserStorage.prepareSort - set event on selector for sorting user list
 */
UserStorage.prototype.prepareSort = function () {
    var asc = document.getElementById('ASC');
    var desc = document.getElementById('DESC');
    var newSort = this.newSort;

    asc.addEventListener("change",function(){
        newSort(event);
    });
    desc.addEventListener("change",function(){
        newSort(event);
    });
}

/**
 * UserStorage.newSort - change sort method and re-render user list 
 */
UserStorage.prototype.newSort = function(event) {
    this.sortMethod = event.target.value;
    this.renderList();
}

/**
 * UserStorage.sortUserList - sort userList
 */
UserStorage.prototype.sortUserList = function() {
    function compare(a,b) {
        if(a.fName > b.fName) {
            return 1
        };
        if (a.fName < b.fName) {
            return -1
        };
        return 0;
    };

    this.userList.sort(compare);

    if (this.sortMethod === 'DESC') {
        this.userList.reverse();
    }
}

/**
 * UserStorage.openCard - prepare data and call User class method renderCard
 */
UserStorage.prototype.openCard = function(event) {
    var target = event.target;
    var className = target.className;

    //find parent container wich contain "dataset.id" and then call render card
    while(className != 'userList') {
        if(className == 'listItem') {
            var user = this.getUserbyId(target.dataset.id);
            user.renderCard();
            return;
        }
        target = target.parentNode;
        className = target.className;
    }
}

/**
 * UserStorage.getUserById - return object User from userList by ID
 * 
 * @param int id 
 */
UserStorage.prototype.getUserbyId = function(id) {
    function isEqual(item){
        if (parseInt(item.id) === parseInt(id)) {
            return true
        }
    }

    var elem = this.userList.find(isEqual);
    return elem;
}

/** 
 * Class User - save user data and render userCard
 * 
 * @param object userModel 
 */
function User(userModel) {
    this.id = userModel.id;
    this.gender = userModel.gender;
    this.email = userModel.email;
    this.city = userModel.city;
    this.postcode = userModel.postcode;
    this.state = userModel.state;
    this.street = userModel.street;
    this.title = userModel.title;
    this.fName = userModel.fName;
    this.lName = userModel.lName;
    this.phone = userModel.phone;
    this.smallPic = userModel.smallPic;
    this.mediumPic = userModel.mediumPic;
    this.largePic = userModel.largePic;
}

/**
 * User.renderCard - render user card
 * 
 */
User.prototype.renderCard = function() {
    // find some DOM elements
    var mainContainer = document.getElementById('container');
    var wrap = document.getElementById('wrap');
    var userCard = document.createElement('div');

    userCard.classList.add('userCard');
    userCard.setAttribute('id','userCard');
    
    //prepare to create DOM elements

    var blocks = {
        'cardBlock_img' : '',
        'cardBlock_id' : '',
        'cardBlock_common_name' : '',
        'cardBlock_clear' : '',
        'cardBlock_city' : '',
        'cardBlock_street' : '',
        'cardBlock_state' : '',
        'cardBlock_postcode' : '',
        'cardBlock_email' : '',
        'cardBlock_phone' : ''
    };
    var captions = {
        'caption_id' : '',
        'caption_name' : '',
        'caption_city' : '',
        'caption_street' : '',
        'caption_state' : '',
        'caption_postcode' : '',
        'caption_email' : '',
        'caption_phone' : ''
    };
    var values = {
        'value_img' : '',
        'value_id' : '',
        'value_title' : '',
        'value_fName' : '',
        'value_lName' : '',
        'value_city' : '',
        'value_street' : '',
        'value_state' : '',
        'value_postcode' : '',
        'value_email' : '',
        'value_phone' : ''
    };

//create DOM elements and set classes

for (element in blocks){
    blocks[element] = document.createElement('div');
    if (element == 'cardBlock_clear'){
        blocks[element].classList.add('cardBlock_clear');
    }else{
        blocks[element].classList.add('cardBlock');
    }
}

for (element in captions){
    captions[element] = document.createElement('div');
    captions[element].classList.add('cardBlock__caption');
}

for (element in values){
    if (element == 'value_img'){
        values[element] = document.createElement('img');
    }else{
        values[element] = document.createElement('div');
    };
    values[element].classList.add('cardBlock__value');
}

    // set data in DOM elements
    captions.caption_id.innerHTML = "ID: ";
    captions.caption_name.innerHTML = "NAME: ";
    captions.caption_city.innerHTML = "CITY: ";
    captions.caption_street.innerHTML = "STREET: ";
    captions.caption_state.innerHTML = "STATE: ";
    captions.caption_postcode.innerHTML = "POSTCODE: ";
    captions.caption_email.innerHTML = "EMAIL: ";
    captions.caption_phone.innerHTML = "PHONE: ";

    values.value_img.src = this.largePic;
    values.value_id.innerHTML = this.id;
    values.value_title.innerHTML = this.title;
    values.value_fName.innerHTML = this.fName;
    values.value_lName.innerHTML = this.lName;
    values.value_city.innerHTML = this.city;
    values.value_street.innerHTML = this.street;
    values.value_state.innerHTML = this.state;
    values.value_postcode.innerHTML = this.postcode;
    values.value_email.innerHTML = this.email;
    values.value_phone.innerHTML = this.phone;
    
    //create DOM structure
    mainContainer.appendChild(userCard);
    
    for (block in blocks){
        userCard.appendChild(blocks[block]); 
    }

    blocks.cardBlock_img.appendChild(values.value_img);

    blocks.cardBlock_id.appendChild(captions.caption_id);
    blocks.cardBlock_id.appendChild(values.value_id);

    blocks.cardBlock_common_name.appendChild(captions.caption_name);
    blocks.cardBlock_common_name.appendChild(blocks.cardBlock_clear);

    blocks.cardBlock_clear.appendChild(values.value_title);
    blocks.cardBlock_clear.appendChild(values.value_fName);
    blocks.cardBlock_clear.appendChild(values.value_lName);

    blocks.cardBlock_street.appendChild(captions.caption_street);
    blocks.cardBlock_street.appendChild(values.value_street);

    blocks.cardBlock_city.appendChild(captions.caption_city);
    blocks.cardBlock_city.appendChild(values.value_city);

    blocks.cardBlock_state.appendChild(captions.caption_state);
    blocks.cardBlock_state.appendChild(values.value_state);

    blocks.cardBlock_postcode.appendChild(captions.caption_postcode);
    blocks.cardBlock_postcode.appendChild(values.value_postcode);

    blocks.cardBlock_email.appendChild(captions.caption_email);
    blocks.cardBlock_email.appendChild(values.value_email);

    blocks.cardBlock_phone.appendChild(captions.caption_phone);
    blocks.cardBlock_phone.appendChild(values.value_phone);

    // setting modal view user card
    wrap.style.display = "block";
}

// init storage
var uStorage = new UserStorage();

// bind methods 
uStorage.openCard = uStorage.openCard.bind(uStorage);
uStorage.addToStorage = uStorage.addToStorage.bind(uStorage);
uStorage.newSort = uStorage.newSort.bind(uStorage);

uStorage.init();   