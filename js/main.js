//CONST
var USERS_SRC = "https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture";
var TIME_OUT = 15000;


/** Class UserStorage - load,render,sort the userlist
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

/** Отрисовка дом элементов на основании полученных данных
 * 
 * 
 * @param {any} loadResults - результат AJAX запроса
 */
// PokemonStorage.prototype.renderPokemons = function(loadResults) {
//     //
//     var container = document.getElementById('container');
//     var row = document.createElement('div');
//     //
//     for (var i = 0; i < loadResults['results'].length; i++) {
//         var pokemonName = loadResults['results'][i].name;
//         var id = i + 1;
//         var picture = POKEMON_IMG + id + '.png';
//         var item = document.createElement('div');
//         var title = document.createElement('div');
//         var img = document.createElement('img');
//         //
//         item.classList.add('item');
//         title.classList.add('item__title');
//         img.classList.add('item__img');
//         //
//         title.innerText = pokemonName;
//         img.src = picture;

//         item.appendChild(title);
//         item.appendChild(img);
//         row.appendChild(item);
//         //Запишем данные покемона в хранилище
//         this.arrPokemons.push({
//             id: pokemonCount,
//             url: loadResults['results'][i].url,
//             name: loadResults['results'][i].name
//         });
//         pokemonCount++;
//     }
//     row.classList.add('row');
//     container.appendChild(row);
//     pokemons = document.querySelectorAll(".item");
//     doPokemonsClick(pokemons);
// }

// // этот метод использовать по конкретному покемону
// PokemonStorage.prototype.loadExtraData = function(loadResults) {
//     //
//     //Сделать перебор элементов массива, и по каждому

//     var xhr = new XMLHttpRequest();
//     var url = loadResults['results'][4].url;
//     xhr.open('GET', url, true);
//     xhr.timeout = TIME_OUT;
//     xhr.ontimeout = function() {
//         console.log('Time is up');
//         var container = document.getElementById('container');
//         container.innerHTML = '<h1 class="error"> Pokemons don`t loaded, please press F5 for reload the page</>';
//     }
//     xhr.send();
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status === 200) {
//                 var lResults = JSON.parse(xhr.responseText);
//                 //Передать результаты на отрисовку DOM элементов
//                 //context.renderPokemons(loadResults);
//                 console.log(lResults);
//             }
//         }
//     }
// }



/** UserStorage method - for load user data from url
 * 
 */
UserStorage.prototype.loadUsers = function() 
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

/** UserStorage method - create objects "User" for each item and push them into class property (array of objects)
 * 
 * @param array results 
 */
UserStorage.prototype.addToStorage = function(results)
{
   // console.log(this.userList);
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
    console.log(this.userList);
}

function User(id,gender,email,city,postcode,state,street,title,fName,lName,phone,smallPic,mediumPic,largePic)
{
    this.id = id;
    this.gender = gender;
    this.email = email;
    this.city = city;
    this.postcode = postcode;
    this.state = state;
    this.street = street;
    this. title = title;
    this. fName = fName;
    this.lName = lName;
    this.phone = phone;
    this.smallPic = smallPic;
    this.mediumPic = mediumPic;
    this.largePic = largePic;
}


var uStorage = new UserStorage(USERS_SRC);
uStorage.loadUsers();