

      var HOST = "wss://crypto-socket-binance.herokuapp.com/";
      var ws = new WebSocket(HOST);
      var el = document.getElementById('server-time');
      ws.onmessage = function (event) {
		AllBinanceData = event.data;
      };
	  
	   var HOST2 = "wss://crypto-socket-bittrex.herokuapp.com/";
      var wss = new WebSocket(HOST2);
      var el = document.getElementById('server-time');
      wss.onmessage = function (event) {
		AllBittrexData = event.data;
      };		

function getBinanceByCode(code) {
var json = JSON.parse(AllBinanceData);
  return json.filter(
    function(json) {
      return json.Market == code 
    }
  );
}

function getBittrexByCode(code) {
var json = JSON.parse(AllBittrexData);
  return json.filter(
    function(json) {
      return json.Market == code 
    }
  );
}

	  function getPercentageChange(oldNumber, newNumber){
    var decreaseValue = oldNumber - newNumber;

    return ((newNumber/oldNumber)-1)*(-100);
}



function getMyNotifications() {
var rekordyN = '';
var currentUser = Parse.User.current();
var user = Parse.User.current();
var relations = user.relation("Notifications");
	var query = relations.query();
	query.include("CryptoCurrency");
	query.find().then(function(results){
	 for (var i in results){
	   var id = results[i].id;
	   var Coin = results[i].get("CoinName");
       var Symbol = results[i].get("Symbol");
	   var Market = results[i].get("Market");
	   var exchange = results[i].get("Exchange");
	   var Pointer = results[i].get("CryptoCurrency");
	   var IMG = Pointer.get("IMGfile");
	   var BelowPrice = results[i].get("BelowPrice");
	   var AbovePrice = results[i].get("AbovePrice");
	   var Kind = results[i].get("KindNotifications");
	   var FavoriteCoin = exchange+'-'+Symbol+'-'+Market;
	   var FavoriteCoinAlert = exchange+'-'+Symbol+'-'+Market+'-'+BelowPrice+'-'+AbovePrice+'-'+id+'-'+Coin;
	   if(MyCoinsAlert.indexOf(FavoriteCoin) > -1){}else{
		MyCoinsAlert.push(FavoriteCoinAlert);
	   }

	}

	$(document).ready(function(){
setInterval(GetAlerts, 2000);
	});

});
}

function getMyNotificationsContent() {
var rekordyN = '';
var currentUser = Parse.User.current();
var user = Parse.User.current();
var relations = user.relation("NotificationsContent");
	var query = relations.query();
	query.find().then(function(results){
     for (var i in results){
	   var id = results[i].id;
       var ContentClass = results[i].get("ContentClass");
	   var ContentID = results[i].get("ContentID");
	   var Kind = results[i].get("KindNotifications");
	   var Cases = results[i].get("Cases");
       var Delete = results[i].get("Delete");
       var UserP = results[i].get("UserP");
       var ChanelP = results[i].get("ChanelP");
       
         SubscribeNotificationsContent(ContentClass, ContentID, Kind, Cases, Delete, UserP, ChanelP);

     }
});  
}                        
    
    
function  SubscribeNotificationsContent(NClass, NID, NKind, NCases, NDelete, userP, ChanelP){
var AllCases = [];
var currentUser = Parse.User.current().id;
var  queryF = new Parse.Query(NClass);
    if(typeof userP == 'undefined') { }else{queryF.include(userP);}
    if(typeof ChanelP == 'undefined') { }else{queryF.include(ChanelP);}
    for(var i in NCases){
    var option = NCases[i].split(":");   
    if(option[0] == "ex"){ 
        queryF.equalTo("ChanelId", NID);
    }
    if(option[0] == "e"){ 
        queryF.equalTo("ChanelId", NID); 
        queryF.equalTo(option[1], option[2]);
    }
    }
let subscription = queryF.subscribe();

        
subscription.on('open', () => {
 console.log('subscription opened');

});

subscription.on('create', (object) => {
console.log("Dodano", object);
if(NClass == "ForumChanel"){
var ChanelName = object.get("ChanelName");
var PointerUser = object.get(userP);
var PointerChanel = object.get(ChanelP); 
var NickName = PointerUser.get("NickName");
var Group = PointerChanel.get("Group");
AddToPushContent(ChanelName, NickName, Group);    
} 

});

subscription.on('delete', (object) => {

});   
        
}

function AddToPushContent(ChanelName, Nick, Group){
var user = Parse.User.current();
var userid = Parse.User.current().id;
var date = new Date();
var PushNotifications = Parse.Object.extend("PushNotifications");
var PushNotifications = new PushNotifications();
PushNotifications.set("Kind", "ContentNote");
PushNotifications.set("ChanelName", ChanelName);
PushNotifications.set("NickName", Nick);    
PushNotifications.set("Date", date);
PushNotifications.set("User", user);
PushNotifications.set("GroupName", Group);    
PushNotifications.set("UserId", userid);
PushNotifications.set("Read", false);
PushNotifications.save().then(function(obj) {
var userN = Parse.User.current();
var relation = userN.relation("PNotifications");
relation.add(obj);
userN.save().then(function(obj2) {
});
});    
}

var AllFriends = [];
function GetMyFriends(){
var rekordyFriends = '';
AllFriends = [];
var UserId = Parse.User.current().id;
var currentUser = Parse.User.current();
var user = Parse.User.current();
var relations = user.relation("MyFriends");
var queryMF = relations.query();
queryMF.equalTo("accepted", true)
queryMF.include("FirstUser");
queryMF.include("SecondUser");
queryMF.find().then(function(results){
     for (var i in results){
      if(results[i].get("ID1") != UserId) {
      var ID =  results[i].id; 
      var IDuser =  results[i].get("ID1");
      var Pointer =  results[i].get("FirstUser");
      var NickName =  Pointer.get("NickName");
      if(Pointer.get("IMGfile")){ var curl = Pointer.get("IMGfile").url();}else{var curl = "https://serwer1708065.home.pl/demo_img/user-1.png";}
      AllFriends.push({
        "IDrelation": ID,
        "NickName": NickName,
        "IDuser"      : IDuser,
        "Opened"      : false,
        "IMG"     : curl
      })}
      if(results[i].get("ID2") != UserId ) {
        var ID =  results[i].id; 
      var IDuser2 =  results[i].get("ID2");
      var Pointer2 =  results[i].get("SecondUser");
      var NickName2 =  Pointer2.get("NickName");
      if(Pointer2.get("IMGfile")){ var curl2 = Pointer2.get("IMGfile").url();}else{var curl2 = "https://serwer1708065.home.pl/demo_img/user-1.png";}
      AllFriends.push({
        "IDrelation": ID,
        "NickName": NickName2,
        "IDuser"      : IDuser2,
        "Opened"      : false,
        "IMG"     : curl2

      })}
     }

for(var i in AllFriends) {
rekordyFriends +='<li id="OpenChat" IMG="'+AllFriends[i].IMG+'" IDrelation="'+AllFriends[i].IDrelation+'"  usrnick="'+AllFriends[i].NickName+'" usrid="'+AllFriends[i].IDuser+'"class="contact"><div class="wrap">';
rekordyFriends +='<span class="contact-status online"></span>';
rekordyFriends +='<img src="'+AllFriends[i].IMG+'" alt="" />';
rekordyFriends +='<div class="meta"><p class="name">'+AllFriends[i].NickName+'</p>';
rekordyFriends +='</div></div></li>';
}

     $("#MyAllFriends").html(rekordyFriends);
}); 

}



$(document).on('click', '#OpenChat', function(){
var userid = $(this).attr("usrid");
var usernick = $(this).attr("usrnick");
var IMG = $(this).attr("IMG");
var IDrelation = $(this).attr("IDrelation");
OpenChat(userid, IMG, usernick, IDrelation);
});


function OpenChat(userid, IMG, usernick, IDrelation){
var rekordyChat = '';
rekordyChat += '<div style= IDrelation="'+IDrelation+'" class="uChat'+IDrelation+'" id="dolnyczat"><div class="content">';
rekordyChat += '<div IDrelation="'+IDrelation+'" userid="'+userid+'" hide="false" class="contact-profile"><p>'+usernick+'</p>';
rekordyChat += '<div IDrelation="'+IDrelation+'" id="closeChat" class="social-media"><i class="fa fa-times"  aria-hidden="true"></i></div>';
rekordyChat += '</div><div id="AllMessageBox'+userid+'" class="messages"><ul id="ChatM'+userid+'">'; 
rekordyChat += '</ul></div>';
rekordyChat += '<div id="message'+IDrelation+'" class="message-input"><div class="wrap">';
rekordyChat += '<input id="inputChat'+IDrelation+'" type="text" placeholder="Write your message..." />';
rekordyChat += '<button class="submit"><i class="fa fa-paperclip" aria-hidden="true"></i></button>';
rekordyChat += '<button userid="'+userid+'" IDrelation="'+IDrelation+'" id="sendMessage" class="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>';
rekordyChat += '</div></div></div></div>'


$("#AllUserChats").append(rekordyChat);
ChatValueOpen(IDrelation);
GetContentChat(userid, IDrelation, IMG); 
}


$(document).on('click', '.contact-profile', function(){
let IDrelation = $(this).attr("IDrelation");
var hide = $(this).attr("hide");
if(hide === "false"){
$(".uChat"+IDrelation).attr("style", "height: 40px;");
$("#message"+IDrelation).attr("style", "display: none;");
$(this).attr("hide", "true");}
else if(hide === "true"){
$(".uChat"+IDrelation).attr("style", "height: 360px;");
$("#message"+IDrelation).attr("style", "display: block;");
$(this).attr("hide", "false");}
});



$(document).on('click', '#settings-hide', function(){
$( "#sidepanel" ).attr("style", "width: 55px;");
$( "#sidepanel" ).attr("id", "sidepanel-small");
$( "#AllUserChats" ).attr("style", "right: 60px;");

$( "#profile").attr("id", "profile-small");
  $(this).attr("id", "settings-show");
  $("#arrow").attr("class", "fa fa-arrow-circle-o-left");
  });

$(document).on('click', '#settings-show', function(){
$( "#sidepanel-small" ).attr("style", "width: 240px;");
$( "#sidepanel-small" ).attr("id", "sidepanel");
$( "#profile-small").attr("id", "profile");
$( "#AllUserChats" ).attr("style", "right: 245px;");
$(this).attr("id", "settings-hide");
$("#arrow").attr("class", "fa fa-arrow-circle-o-right");
  });

function GetContentChat(user, ID, userIMG) {
var MYid = Parse.User.current().id;
var cUser = Parse.User.current();


if(cUser.get("IMGfile")){ 
var curl = cUser.get("IMGfile").url();}else{
var curl = "https://serwer1708065.home.pl/demo_img/user-1.png";}
var rekordyContent = '';

var Message = Parse.Object.extend("Message");
var MessageQuery = new Parse.Query(Message);
MessageQuery.equalTo("relationID", ID)
MessageQuery.descending("createdAt");
MessageQuery.limit(20);
MessageQuery.find().then(function(results){
for(var i in results){
var id1 = results[i].get("ID1");
var id2 = results[i].get("ID2");
var content = results[i].get("content");

if(id1 === MYid) {
rekordyContent = '';
rekordyContent += '<li class="replies"><img src="'+curl+'" alt="" />';
rekordyContent += '<p>'+content+'</p></li>';

}
if(id1 === user) {
rekordyContent = '';
rekordyContent += '<li class="sent"><img src="'+userIMG+'" alt="" />';
rekordyContent += '<p>'+content+'</p></li>';
}

$("#ChatM"+user).prepend(rekordyContent); 
}

$("#ChatM"+user).prepend('<li><button>load more</button></li>'); 


console.log(AllFriends);
 $("#AllMessageBox"+user).animate({ scrollTop: $("#AllMessageBox"+user).prop("scrollHeight")}, 500);  
});
}


function ChatValueOpen( value ) {
    for( var i = 0; i < AllFriends.length; ++i ) {
        if(AllFriends[i].IDrelation == value) {
            AllFriends[i].Opened = true ;
        }
    }
    return AllFriends;
}

function ChatValueClose( value ) {
    for( var i = 0; i < AllFriends.length; ++i ) {
        if(AllFriends[i].IDrelation == value) {
            AllFriends[i].Opened = false ;
        }
    }
    return AllFriends;
}


function SubscribeMyMessage(){ 
var cUserid = Parse.User.current().id;
var queryMessage = new Parse.Query("Message");
queryMessage.equalTo("ID2", cUserid);
queryMessage.equalTo("Read", false);
queryMessage.include("Friends");
subscriptionMessage = queryMessage.subscribe();
    
    
subscriptionMessage.on('open', () => {
 console.log('subscription opened');
});





subscriptionMessage.on('create', (object) => {
var pointer = object.get("Friends");
var IDrelation = pointer.id;
console.log(IDrelation);
var Chat = CheckIsChatOpened(IDrelation);

if(Chat[0].Opened){
var rekordyContent = '';
var cUser = Parse.User.current(); 
 if(cUser.get("IMGfile")){ 
var curl = cUser.get("IMGfile").url();}else{
var curl = "https://serwer1708065.home.pl/demo_img/user-1.png";} 
var id1 = object.get("ID1");
var id2 = object.get("ID2");
var content = object.get("content");
var userinfo = getFriendsInfo(id1);
rekordyContent = '';
rekordyContent += '<li class="sent"><img src="'+userinfo[0].IMG+'" alt="" />';
rekordyContent += '<p>'+content+'</p></li>';
$( document ).ready(function() {
$("#ChatM"+id1).append(rekordyContent);

 $("#AllMessageBox"+id1).animate({ scrollTop: $("#AllMessageBox"+id1).prop("scrollHeight")}, 500);   
});   
}else if(Chat[0].Opened == false){
var id1 = object.get("ID1");
var userinfo = getFriendsInfo(id1);  
OpenChat(id1, userinfo[0].IMG, userinfo[0].NickName, IDrelation);
}
}); 

subscriptionMessage.on('delete', (object) => {


});                    
}

    function getFriendsInfo(code) {
var json = JSON.parse(JSON.stringify(AllFriends));
  return json.filter(
    function(json) {
      return json.IDuser == code 
    }
  );
}

    function CheckIsChatOpened(code) {
var json = JSON.parse(JSON.stringify(AllFriends));
  return json.filter(
    function(json) {
      return json.IDrelation == code 
    }
  );
}



$(document).on('click', '#closeChat', function(){
let IDrelation = $(this).attr("IDrelation");
ChatValueClose(IDrelation);
$(".uChat"+IDrelation).remove();
});



$(document).on('click', '#sendMessage', function(){
 var cUser = Parse.User.current();
if(cUser.get("IMGfile")){ 
var curl = cUser.get("IMGfile").url();}else{
var curl = "https://serwer1708065.home.pl/demo_img/user-1.png";}
var rekordyContent = ''; 
let MYid = Parse.User.current().id;
var ID = $(this).attr("IDrelation");
let content = $("#inputChat"+ID).val();
let userid = $(this).attr("userid");
var Friends = Parse.Object.extend("Friends");  
var Message = Parse.Object.extend("Message"); 
var postACL = new Parse.ACL(); 
postACL.setWriteAccess(userid, true);
postACL.setReadAccess(userid, true);
postACL.setWriteAccess(MYid, true);
postACL.setReadAccess(MYid, true);      
Message = new Message();
Message.set("ID1", MYid);
Message.set("ID2", userid);
Message.set("content", content);
Message.set("Read", false);
Message.set("relationID", ID);
Message.set("Friends", Friends.createWithoutData(ID));
Message.setACL(postACL);
Message.save().then(function(obj) {
rekordyContent = '';
rekordyContent += '<li class="replies"><img src="'+curl+'" alt="" />';
rekordyContent += '<p>'+content+'</p></li>';
$( document ).ready(function() {
$("#ChatM"+userid).append(rekordyContent); 
});
 $("#AllMessageBox"+userid).animate({ scrollTop: $("#AllMessageBox"+userid).prop("scrollHeight")}, 1000);  
$("#inputChat"+ID).val(""); 
});
}); 





function FindFriend(name){
var rekordyFind = '';
var query = new Parse.Query(Parse.User);
query.contains('NickName', name);
query.limit(5);
query.find()
  .then(function(results) {
    if(results.length > 0) {
   for(var i in results){
    var NickName = results[i].get("NickName");
    var id = results[i].id;
    var Check = getFriendsInfo(id);
    if(Check.length > 0){
    rekordyFind += '<span>'+NickName+' added</span>';
    }else{
    rekordyFind += '<span>'+NickName+' <i class="fa fa-plus-circle" id="SetInvate" Fid="'+id+'" aria-hidden="true"></i></span>';
    }
    }
    $(".searched").html(rekordyFind);
  }else{
    $(".searched").html("Not found");
  }
  })
  .catch(function(error) {
    // There was an error.
  });
}

$(document).on('click', '#SetInvate', function(){
let id =  $(this).attr("Fid");
$(this).attr("class", "fa fa-check-circle-o");
let MyId = Parse.User.current().id;
let postACL = new Parse.ACL(); 
postACL.setWriteAccess(MyId, true);
postACL.setReadAccess(MyId, true);
postACL.setWriteAccess(id, true);
postACL.setReadAccess(id, true);
var Users = Parse.Object.extend(Parse.User);
var Friends = Parse.Object.extend("Friends");
var Friends = new Friends();
Friends.set("ID1", MyId);
Friends.set("ID2", id);
Friends.set("accepted", false);
Friends.set("FirstUser", Users.createWithoutData(MyId));
Friends.set("SecondUser", Users.createWithoutData(id));
Friends.setACL(postACL);
Friends.save().then(function(obj) {
var user = Parse.User.current();
var relation = user.relation("MyFriends");
relation.add(obj);
user.save().then(function(obj2) {
$( "#inputFriends" ).val("");
$( "#AddFriend" ).dialog( "close" );  
}); }); 
});


function GetFriendsInvate() {
var cUser = Parse.User.current().id;
let queryFriends = new Parse.Query("Friends");
queryFriends.equalTo("ID2", cUser);
queryFriends.equalTo("accepted", false);
queryFriends.include("FirstUser");
queryFriends.include("SecondUser");
queryFriends.descending("createdAt");
queryFriends.find().then(function(friends){
$("#FriendsInvateCount").text(friends.length);
    var rekordyFriends = '';
   for(let i in friends)  {
var FirstUser = friends[i].get("FirstUser");
var Inviting = friends[i].get("ID1");
var NickName = FirstUser.get("NickName");
if(FirstUser.get("IMGfile")){ var curl = FirstUser.get("IMGfile").url();}else{var curl = "https://serwer1708065.home.pl/demo_img/user-1.png";}

rekordyFriends += '<li><div class="friend-requests-info">';
rekordyFriends += '<div class="thumb"><a href="#"><img src="'+curl+'" alt=""></a></div>';
rekordyFriends += '<a href="#" class="name">'+NickName+' </a><span>Invate you : <button id="AddtoFriends" userinviting="'+Inviting+'">Add Friends</button></span></div></li>';


}
$("#FriendsInvate").html(rekordyFriends);
    });
}


$(document).on('click', '#AddtoFriends', function(){
var MyId = Parse.User.current().id;
var invitingID =  $(this).attr("userinviting")
let queryFriends = new Parse.Query("Friends");
var postACL = new Parse.ACL(); 
queryFriends.equalTo("ID1", invitingID );
queryFriends.first().then(function(object){
object.set("accepted", true);
object.save().then(function(obj) {
var user = Parse.User.current();
var relation = user.relation("MyFriends");
relation.add(obj);
user.save().then(function(obj2) {
GetFriendsInvate(); 
GetMyFriends();
}); }); });
});


function GetSubscribeFriends(){

var cUser = Parse.User.current().id;
let queryFriends = new Parse.Query("Friends");
queryFriends.equalTo("ID2", cUser);
queryFriends.include("FirstUser");
queryFriends.include("SecondUser");
queryFriends.descending("createdAt");
let subscriptionInvate = queryFriends.subscribe();
    
    
subscriptionInvate.on('open', () => {
 console.log('subscription opened');
});


subscriptionInvate.on('create', (object) => {
var count = $("#FriendsInvateCount").text();
$("#FriendsInvateCount").text(parseInt(count) + 1);
var rekordyInvate = '';    
var FirstUser = object.get("FirstUser");
var Inviting = object.get("ID1");
var NickName = FirstUser.get("NickName");
if(FirstUser.get("IMGfile")){ var curl = FirstUser.get("IMGfile").url();}else{var curl = "https://serwer1708065.home.pl/demo_img/user-1.png";}

rekordyInvate += '<li><div class="friend-requests-info">';
rekordyInvate += '<div class="thumb"><a href="#"><img src="'+curl+'" alt=""></a></div>';
rekordyInvate += '<a href="#" class="name">'+NickName+' </a><span>Invate you : <button id="AddtoFriends" userinviting="'+Inviting+'">Add Friends</button></span></div></li>';

 $("#FriendsInvate").prepend(rekordyInvate);

}); 

subscriptionInvate.on('update', (object) => {                  
});
}



function GetSubscribeAcceptedFriends(){
var cUser = Parse.User.current().id;
let queryFriends = new Parse.Query("Friends");
queryFriends.equalTo("ID1", cUser);
queryFriends.include("FirstUser");
queryFriends.include("SecondUser");
let subscriptionAccepted = queryFriends.subscribe();
    
    
subscriptionAccepted.on('open', () => {
 console.log('subscription opened');
});

subscriptionAccepted.on('update', (object) => {
GetMyFriends();
console.log("updated");

});
}

    
function GetAlerts(){

for(var i in MyCoinsAlert){
var CoinsVal = MyCoinsAlert[i].split("-");
if(CoinsVal[0] == "Binance"){
var Pair = CoinsVal[1]+CoinsVal[2];
var foundF = getBinanceByCode(Pair);
if(typeof foundF[0].Last == "undefined") {var Price = "0.00000000"}else {var Price = foundF[0].Last;}
var below = CoinsVal[3];
var Above = CoinsVal[4];
var id = CoinsVal[5];
var coin = CoinsVal[6];
if(parseFloat(Price) > parseFloat(Above)) { 
alertPrice(MyCoinsAlert[i], Price, id); 
AddToPush(MyCoinsAlert[i], Price, coin);
var index = MyCoinsAlert.indexOf(MyCoinsAlert[i]); 
MyCoinsAlert.splice(index, 1);
}

}
if(CoinsVal[0] == "Bittrex"){
var Pair = CoinsVal[1]+CoinsVal[2];
var foundF = getBittrexByCode(Pair);
if(typeof foundF[0].Last == "undefined") {var Price = "0.00000000"}else {var Price = foundF[0].Last;}
var below = CoinsVal[3];
var Above = CoinsVal[4];
var id = CoinsVal[5];
var coin = CoinsVal[6];
if(parseFloat(Price) < parseFloat(below)) { 
alertPrice(MyCoinsAlert[i], Price, id); 
AddToPush(MyCoinsAlert[i], Price, coin);
var index = MyCoinsAlert.indexOf(MyCoinsAlert[i]); 
MyCoinsAlert.splice(index, 1);
}
}

}

}

function alertPrice(allinfo, price, id) {
var priceA = parseFloat(price);
var all = allinfo.split("-");
var date = new Date();
var user = Parse.User.current();
var relations = user.relation("Notifications");
	var query = relations.query();
	query.equalTo("objectId", id);
	query.first().then(function(object){
	object.destroy();
});
}

function AddToPush(allinfo, price, CoinName){
var user = Parse.User.current();
var userid = Parse.User.current().id;
var all = allinfo.split("-");
var date = new Date();
var PushNotifications = Parse.Object.extend("PushNotifications");
var PushNotifications = new PushNotifications();
PushNotifications.set("Kind", "CoinAlert");
PushNotifications.set("Symbol", all[1]);
PushNotifications.set("Coin", CoinName);
PushNotifications.set("Market", all[2]);
PushNotifications.set("Exchange", all[0]);
PushNotifications.set("Date", date);
PushNotifications.set("User", user);
PushNotifications.set("UserId", userid);
PushNotifications.set("Read", false);
PushNotifications.set("Price", price);
PushNotifications.save().then(function(obj) {
var userN = Parse.User.current();
var relation = userN.relation("PNotifications");
relation.add(obj);
userN.save().then(function(obj2) {
getMyNotifications();
});
});
}
    
    function GetAllPushNotifications(){
var rekordyPush = '';
var currentUser = Parse.User.current();
var user = Parse.User.current();
var relations = user.relation("PNotifications");
	var query = relations.query();
	query.descending("Date");
    query.equalTo("Read", false);
	query.count().then(function(count) {
	console.log(count);
        $('#NotificationsCount').text(count);
    var query2 = relations.query();
        query2.descending("Date");
        query2.limit(20);
        query2.find().then(function(results){
		 for (var i in results){
    var Kind = results[i].get("Kind");
	if(Kind == "CoinAlert"){
    var id = results[i].id;    
	var Symbol = results[i].get("Symbol");
	var Market = results[i].get("Market");
	var Exchange = results[i].get("Exchange");
	var Price = results[i].get("Price");
    var Read = results[i].get("Read");
	var date = results[i].get("Date");
        date = date.toISOString();
    var Datesplit = date.split("T");
    var Time = Datesplit[1].split(":");
    var Title = Symbol+"/"+Market+":  "+Exchange;
    if(Read){var read = '<li>'}else{ var read = '<li id="'+id+'" class="NotificationRead" style="background: #f1f1f1">'}    
rekordyPush += ''+read+'<div class="notification-info"><a ><i class="fa fa-bell color-1"></i>';
rekordyPush += '<strong>'+Title+'</strong> Price:  <span>'+Price+'</span>';
rekordyPush += '<h5 class="time">'+Datesplit[0]+'  '+Time[0]+':'+Time[1]+'</h5></a></div></li>';
}
    if(Kind == "ContentNote"){
    var id = results[i].id;    
	var ChanelName = results[i].get("ChanelName");
	var NickName = results[i].get("NickName");
    var GroupName = results[i].get("GroupName");    
    var Read = results[i].get("Read");
	var date = results[i].get("Date");
        date = date.toISOString();
    var Datesplit = date.split("T");
    var Time = Datesplit[1].split(":");
    var Title = GroupName+'/'+ChanelName;
    if(Read){var read = '<li>'}else{ var read = '<li id="'+id+'" class="NotificationRead" style="background: #f1f1f1">'}    
rekordyPush += ''+read+'<div class="notification-info"><a ><i class="fa fa-bell color-1"></i>';
rekordyPush += '<strong>'+Title+'</strong> Post aded:  <span>'+NickName +'</span>';
rekordyPush += '<h5 class="time">'+Datesplit[0]+'  '+Time[0]+':'+Time[1]+'</h5></a></div></li>';
}
}
$("#NotificationsPush").html(rekordyPush);
            GetSubscribePushNotifications();
});});
}
    
    
    function GetSubscribePushNotifications(){
var user = Parse.User.current();
var currentUser = Parse.User.current().id;
var  queryF = new Parse.Query("PushNotifications");
queryF.equalTo("UserId", currentUser);
let subscription = queryF.subscribe();

        
subscription.on('open', () => {
 console.log('subscription opened');

});

subscription.on('create', (object) => {
    var count = $('#NotificationsCount').text();
    var newCount = parseInt(count)+1;
    var rekordyPush = '';
    var Kind = object.get("Kind");
	if(Kind == "CoinAlert"){
    var id = object.id;    
	var Symbol = object.get("Symbol");
	var Market = object.get("Market");
	var Exchange = object.get("Exchange");
	var Price = object.get("Price");
    var Read = object.get("Read");
	var date = object.get("Date");
        date = date.toISOString();
    var Datesplit = date.split("T");
    var Time = Datesplit[1].split(":");
    var Title = Symbol+"/"+Market+":  "+Exchange;
    if(Read){var read = '<li>'}else{ var read = '<li id="'+id+'" class="NotificationRead" style="background: #f1f1f1">'}    
rekordyPush += ''+read+'<div class="notification-info"><a><i class="fa fa-bell color-1"></i>';
rekordyPush += '<strong>'+Title+'</strong> Price:  <span>'+Price+'</span>';
rekordyPush += '<h5 class="time">'+Datesplit[0]+'  '+Time[0]+':'+Time[1]+'</h5></a></div></li>';
}
        if(Kind == "ContentNote"){
    var id = object.id;    
	var ChanelName = object.get("ChanelName");
	var NickName = object.get("NickName");
    var GroupName = object.get("GroupName");    
    var Read = object.get("Read");
	var date = object.get("Date");
        date = date.toISOString();
    var Datesplit = date.split("T");
    var Time = Datesplit[1].split(":");
    var Title = GroupName+'/'+ChanelName;
    if(Read){var read = '<li>'}else{ var read = '<li id="'+id+'" class="NotificationRead" style="background: #f1f1f1">'}    
rekordyPush += ''+read+'<div class="notification-info"><a><i class="fa fa-bell color-1"></i>';
rekordyPush += '<strong>'+Title+'</strong> Post aded:  <span>'+NickName +'</span>';
rekordyPush += '<h5 class="time">'+Datesplit[0]+'  '+Time[0]+':'+Time[1]+'</h5></a></div></li>';
}
$('#NotificationsCount').text(newCount);
$("#NotificationsPush").prepend(rekordyPush);
});

subscription.on('delete', (object) => {

});                      
} 
    

    
    $(document).on('click', '.NotificationRead', function(){
    var count = $('#NotificationsCount').text();
    var newCount = parseInt(count)-1;
        $('#NotificationsCount').text(newCount);
      var id = $(this).attr('id');
        $(this).removeAttr("style");
      var user = Parse.User.current();
      var relations = user.relation("PNotifications");
	  var query = relations.query();    
      query.equalTo("objectId", id);
      query.first().then(function(object){
          object.set('Read', true);
          object.save().then(function(save){
        
              }); 
          });    
     });  

 function getMyInvests() {
var currentUser = Parse.User.current();
var user = Parse.User.current();
var relations = user.relation("MyInvest");
	var query = relations.query();
	query.include("CryptoCurrency");
	query.find().then(function(results){
	 for (var i in results){
	   var id = results[i].id;
	   var Coin = results[i].get("CoinName");
       var Symbol = results[i].get("Symbol");
	   var Market = results[i].get("Market");
	   var PriceBuy = results[i].get("PriceBuy");
	   var exchange = results[i].get("Exchange");
	   var IMG = results[i].get("IMGfile");
	   var Qty = results[i].get("Qty");
	   
	  
	   var FavoriteCoin = exchange+'-'+Symbol+'-'+Market+'-'+Qty+'-'+PriceBuy;
	   if(MyCoinsInvest.indexOf(FavoriteCoin) > -1){}else{
	   	MyCoinsInvest.push(FavoriteCoin);
	   }

	}

	$(document).ready(function(){
setInterval(getValuesInvest, 2500);
	});

});
}



function SearchChanel(inputsearch){
var rekordySerched = '';
var query = new Parse.Query("ForumChanel");
query.fullText('Content', inputsearch);
query.select('Content', 'User');
query.descending('createdAt');
query.include("User");
query.limit(5);
query.find()
  .then(function(results) {
    if(results.length > 0) {
   for(var i in results){
    var content = results[i].get("Content");
    var Pointer = results[i].get("User");
    var NickName = Pointer.get("NickName")
    rekordySerched += '<li>  '+NickName+': '+content+'<li>';

    
}
  }else{
  $("#AllSearched").html("<li>No results</li>");
  $("#AllSearched").attr("style", "display: block");     
}
if(rekordySerched.length > 0){  
$("#AllSearched").html(rekordySerched);
$("#AllSearched").attr("style", "display: block");
}else{
$("#AllSearched").html("<li>No results</li>");
$("#AllSearched").attr("style", "display: block");   
}
})
  
  .catch(function(error) {
   console.log(error);
  });
    
} 


function getValuesInvest(){
var AllDollarBinance = [];
var AllDollarBittrex = [];
if(typeof AllBinanceData !== "undefined"){
for(var i in MyCoinsInvest){
var CoinsVal = MyCoinsInvest[i].split("-");  
if(CoinsVal[0] == "Binance"){
var Pair = CoinsVal[1]+CoinsVal[2];
var foundF = getBinanceByCode(Pair);
if(typeof foundF[0].Last == "undefined") {var Price = "0.00000000"}else {var Price = foundF[0].Last;}
if(typeof foundF[0].Volumen == "undefined") {var Volumen = "0.00000000"}else {var Volumen = foundF[0].Volumen;}
if(typeof foundF[0].Prev == "undefined") {var Percent = "0.00000000"}else {var Percent = foundF[0].Prev;}
if(CoinsVal[2] == "USDT"){
if(Price > 1){ var PriceA = parseFloat(Price).toFixed(2);}
if(Price < 1){ var PriceA = parseFloat(Price).toFixed(5);}
var Vol = parseFloat(Volumen).toFixed(2);
var change = parseFloat(Percent).toFixed(2);
var qty = CoinsVal[3];
var MyValue = (parseFloat(qty)*PriceA).toFixed(2);
AllDollarBinance.push(MyValue);
}
if(CoinsVal[2] == "BTC"){
var getBTCPrice = getBinanceByCode("BTCUSDT");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var Vol = parseFloat(Volumen).toFixed(2);
var change = parseFloat(Percent).toFixed(2);
var qty = CoinsVal[3];
var MyValue = (parseFloat(qty)*USDp).toFixed(2);
AllDollarBinance.push(MyValue);
}
if(CoinsVal[2] == "ETH"){
var getBTCPrice = getBinanceByCode("ETHUSDT");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var Vol = parseFloat(Volumen).toFixed(2);
var change = parseFloat(Percent).toFixed(2);
var qty = CoinsVal[3];
var MyValue = (parseFloat(qty)*USDp).toFixed(2);
AllDollarBinance.push(MyValue);
}
if(CoinsVal[2] == "BNB"){
var getBTCPrice = getBinanceByCode("BNBUSDT");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var Vol = parseFloat(Volumen).toFixed(2);
var change = parseFloat(Percent).toFixed(2);
var qty = CoinsVal[3];
var MyValue = (parseFloat(qty)*USDp).toFixed(2);
AllDollarBinance.push(MyValue);
}
}
if(CoinsVal[0] == "Bittrex"){
var Pair = CoinsVal[2]+"-"+CoinsVal[1];
var foundx = getBittrexByCode(Pair);
var Price = foundx[0].Last;
var Volumen = foundx[0].Volumen;
var Percent = foundx[0].Prev;

if(CoinsVal[2] == "USDT"){
if(Price > 1){ var PriceA = parseFloat(Price).toFixed(2);}
if(Price < 1){ var PriceA = parseFloat(Price).toFixed(5);}
var Vol = parseFloat(Volumen).toFixed(2);
var percents = getPercentageChange(Price, Percent);
var change = percents.toFixed(2);
var qty = CoinsVal[3];
var MyValue = (parseFloat(qty)*PriceA).toFixed(2);
AllDollarBittrex.push(MyValue);
}
if(CoinsVal[2] == "BTC"){
var getBTCPrice = getBittrexByCode("USDT-BTC");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
var qty = CoinsVal[3];
var MyValue = (parseFloat(qty)*USDp).toFixed(2);
AllDollarBittrex.push(MyValue);
}
if(CoinsVal[2] == "ETH"){
var getBTCPrice = getBittrexByCode("USDT-ETH");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var Vol = parseFloat(Volumen).toFixed(2);
var percents = getPercentageChange(Price, Percent);
var change = percents.toFixed(2);
var qty = CoinsVal[3];
var MyValue = (parseFloat(qty)*USDp).toFixed(2);
AllDollarBittrex.push(MyValue);
}
}

}
    console.log(AllDollarBinance);
var countAllBinance = 0;
var countAllBittrex = 0;

var getBTCBinance = getBittrexByCode("USDT-BTC");
var PriceBinance = getBTCBinance[0].Last;
var getBTCBittrex = getBinanceByCode("BTCUSDT");
var PriceBittrex = getBTCBittrex[0].Last;
for(var x in AllDollarBinance){
countAllBinance = countAllBinance+parseFloat(AllDollarBinance[x]);
}
for(var x in AllDollarBittrex){
countAllBittrex = countAllBittrex+parseFloat(AllDollarBittrex[x]);
}
var BTCValBinance = countAllBinance/parseFloat(PriceBinance);
var BTCValBittrex = countAllBittrex/parseFloat(PriceBittrex);
console.log(countAllBittrex, countAllBinance, BTCValBinance, BTCValBittrex);
AllBTC = (BTCValBinance+BTCValBittrex).toFixed(8);
AllDollar = (countAllBittrex+countAllBinance).toFixed(2);
$("#MyAllInvest").html('<i class="fa fa-btc"></i> '+AllBTC+' BTC / <i class="fa fa-dollar"></i>  '+numberWithSpaces(AllDollar)+' USD</a>');
}else{}
}

function getMyCurrency() {
var	rekordy = '';
	   rekordy  += '<li class="color-2">';
	   rekordy  += '<a href="crypto.html#bitcoin#BINANCE:BTCUSDT">';
	   rekordy  += '<img src="coins/bitcoin.png">';
	   rekordy  += '<div class="krypto">';
	   rekordy  += '<span class="AllCBinance-BTC-USDT"></span>';
	   rekordy  += '<b class="priceCBinance-BTC-USDT"><i class="fa fa-circle-o-notch fa-spin" style="font-size:10px"></i></b>';		
	   rekordy  += '</div></a></li>';
	   MyCoinsMenu.push("Binance-BTC-USDT");
var user = Parse.User.current();
var relations = user.relation("Favorite");
	var query = relations.query();
	query.include("CryptoCurrency");
	query.find().then(function(results){
	 for (var i in results){
	   var id = results[i].id;
	   var Coin = results[i].get("CoinName");
       var Symbol = results[i].get("Symbol");
	   var Exchange = results[i].get("exchange");
	   var Market = results[i].get("Market");
	   var IMG = results[i].get("IMGfile");
	   var FavoriteCoin = Exchange+'-'+Symbol+'-'+Market;
    if(MyCoinsMenu.indexOf(FavoriteCoin) > -1){}else{
	   MyCoinsMenu.push(FavoriteCoin);}

	   
	  
	   rekordy  += '<li class="color-2">';
	   rekordy += '<a href="crypto.html#'+IMG+'#'+Exchange.toUpperCase()+':'+Symbol+Market+'">';
	   rekordy += '<img src="coins/'+IMG+'.png">';
	   rekordy += '<div class="krypto">';
	   rekordy += '<span class="AllC'+FavoriteCoin+'"></span>';
	   rekordy += '<b class="priceC'+FavoriteCoin+'"><i class="fa fa-circle-o-notch fa-spin" style="font-size:10px"></i></b>';		
	   rekordy += '</div></a></li>';
	   

	}
	rekordy += '<li class="right"><i class="fa fa-list" id="showFriends" style="margin-top: 7px; font-size: 24px;"></i></li>';
	$( "#AllCryptoO" ).html( rekordy );

	setInterval(getMenuValue, 2000);
});
}




function getMenuValue(){
console.log(MyCoinsMenu);
if(typeof AllBinanceData !== "undefined"){
for(var i in MyCoinsMenu){
var CoinsVal = MyCoinsMenu[i].split("-");
if(CoinsVal[0] == "Binance"){
var Pair = CoinsVal[1]+CoinsVal[2];
var foundF = getBinanceByCode(Pair);
if(typeof foundF[0].Last == "undefined") {var Price = "0.00000000"}else {var Price = foundF[0].Last;}
if(typeof foundF[0].Volumen == "undefined") {var Volumen = "0.00000000"}else {var Volumen = foundF[0].Volumen;}
if(typeof foundF[0].Prev == "undefined") {var Percent = "0.00000000"}else {var Percent = foundF[0].Prev;}

if(CoinsVal[2] == "USDT"){
if(Price > 1){ var PriceA = parseFloat(Price).toFixed(2);}
if(Price < 1){ var PriceA = parseFloat(Price).toFixed(5);}
var change = parseFloat(Percent).toFixed(2);
if(change > 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: green;"> ('+change+'%)</i>';
if(change < 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: red;"> ('+change+'%)</i>'; 
$(".AllC"+MyCoinsMenu[i]).html(Per);
$(".priceC"+MyCoinsMenu[i]).html("<i class='fa fa-usd'></i> "+numberWithSpaces(PriceA));
$(".priceC"+MyCoinsMenu[i]).attr("value", PriceA);    
}
if(CoinsVal[2] == "BTC"){
var getBTCPrice = getBinanceByCode("BTCUSDT");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var change = parseFloat(Percent).toFixed(2);
if(change > 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: green;"> ('+change+'%)</i>';
if(change < 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: red;"> ('+change+'%)</i>'; 
$(".AllC"+MyCoinsMenu[i]).html(Per);
$(".priceC"+MyCoinsMenu[i]).html("<i class='fa fa-btc'></i> "+numberWithSpaces(PriceA));
$(".priceC"+MyCoinsMenu[i]).attr("value", PriceA); 
}
if(CoinsVal[2] == "ETH"){
var getBTCPrice = getBinanceByCode("ETHUSDT");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var change = parseFloat(Percent).toFixed(2);
if(change > 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: green;"> ('+change+'%)</i>';
if(change < 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: red;"> ('+change+'%)</i>'; 
$(".AllC"+MyCoinsMenu[i]).html(Per);
$(".priceC"+MyCoinsMenu[i]).html("<i class='fa fa-eth'></i> "+numberWithSpaces(PriceA));
}
if(CoinsVal[2] == "BNB"){
var getBTCPrice = getBinanceByCode("BNBUSDT");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var change = parseFloat(Percent).toFixed(2);
if(change > 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: green;"> ('+change+'%)</i>';
if(change < 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: red;"> ('+change+'%)</i>'; 
$(".AllC"+MyCoinsMenu[i]).html(Per);
$(".priceC"+MyCoinsMenu[i]).html(""+numberWithSpaces(PriceA));
$(".priceC"+MyCoinsMenu[i]).attr("value", PriceA);     
}
}
if(CoinsVal[0] == "Bittrex"){
var Pair = CoinsVal[2]+"-"+CoinsVal[1];
var foundx = getBittrexByCode(Pair);
var Price = foundx[0].Last;
var Volumen = foundx[0].Volumen;
var Percent = foundx[0].Prev;
if(CoinsVal[2] == "USDT"){
if(Price > 1){ var PriceA = parseFloat(Price).toFixed(2);}
if(Price < 1){ var PriceA = parseFloat(Price).toFixed(5);}
var percents = getPercentageChange(Price, Percent);
var change = percents.toFixed(2);
if(change > 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: green;"> ('+change+'%)</i>';
if(change < 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: red;"> ('+change+'%)</i>'; 
$(".AllC"+MyCoinsMenu[i]).html(Per);
$(".priceC"+MyCoinsMenu[i]).html("<i class='fa fa-usd'></i> "+numberWithSpaces(PriceA));
$(".priceC"+MyCoinsMenu[i]).attr("value", PriceA);     
}
if(CoinsVal[2] == "BTC"){
var getBTCPrice = getBittrexByCode("USDT-BTC");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var percents = getPercentageChange(Price, Percent);
var change = percents.toFixed(2);
if(change > 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: green;"> ('+change+'%)</i>';
if(change < 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: red;"> ('+change+'%)</i>'; 
$(".AllC"+MyCoinsMenu[i]).html(Per);
$(".priceC"+MyCoinsMenu[i]).html("<i class='fa fa-btc'></i> "+numberWithSpaces(PriceA));
}
if(CoinsVal[2] == "ETH"){
var getBTCPrice = getBittrexByCode("USDT-ETH");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var percents = getPercentageChange(Price, Percent);
var change = percents.toFixed(2);
if(change > 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: green;"> ('+change+'%)</i>';
if(change < 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: red;"> ('+change+'%)</i>'; 
$(".AllC"+MyCoinsMenu[i]).html(Per);
$(".priceC"+MyCoinsMenu[i]).html("<i class='fa fa-eth'></i> "+numberWithSpaces(PriceA));
$(".priceC"+MyCoinsMenu[i]).attr("value", PriceA);     
}
}

}							      
}else{
}
}


function getAllGroups() {
var rekordyG = '<li><a href="groups.html"><i class="fa fa-users"></i>Groups</a></li>'
var cUser = Parse.User.current();
  var GroupsPermission = Parse.Object.extend("GroupsPermission");
    var Query_Groups = new Parse.Query(GroupsPermission);
    Query_Groups.equalTo("UserPointer", cUser);
	Query_Groups.include("GroupPointer");
    Query_Groups.find({	
	success: function(results) {
	 for (var i in results){
 var DateEx = results[i].get("exDate");
 var UserKey = results[i].get("UserKey");
 var Pointer = results[i].get("GroupPointer");
 var GroupName = Pointer.get("GroupName");
  var ShortName = Pointer.get("short");
	 
  var endDate =   new Date(); 
  var nDays = diffDays(endDate, DateEx);
  rekordyG += '<li><a href="forum.html#'+UserKey+'"><h3>'+ShortName[0]+'<span>'+ShortName[1]+'</span></h3>'+GroupName+'  <small>('+nDays+' days)</small></a></li>';
	

	}
	$( "#AllGroups" ).html( rekordyG );

  },
  error: function(error) {
    console.log("Error: "+error.message);
  }
});
}

function diffDays(d1, d2)
{
  var ndays;
  var tv1 = d1.valueOf();  // msec since 1970
  var tv2 = d2.valueOf();

  ndays = (tv2 - tv1) / 1000 / 86400;
  ndays = Math.round(ndays - 0.5);
  return ndays;
}

   $(document).on('click', '#showFriends', function(){
    document.getElementById("mySidenav").style.display = "block";
    $(this).attr("id", "closeFriends");
    });

    $(document).on('click', '#closeFriends', function(){
    document.getElementById("mySidenav").style.display = "none";
    $(this).attr("id", "showFriends");
    
    });

  function getTypes(){
var AllTypes = [];
var AllTypesJSON = [];
  var Bittrex = Parse.Object.extend("Bittrex");
  var Binance = Parse.Object.extend("Binance");
    var Query_Binance = new Parse.Query(Binance);
    Query_Binance.exists("Chart");
	Query_Binance.limit(250);
	Query_Binance.include("CryptoCurrency");
    Query_Binance.find().then(function(BinanceCoins){
	for(var i in BinanceCoins){
    var Coin = BinanceCoins[i].get("Chart");
	var CoinName = BinanceCoins[i].get("CoinName");
	var Pointer = BinanceCoins[i].get("CryptoCurrency");
	var IMG = Pointer.get("IMGfile");
	if(AllTypes.indexOf(Coin) > -1){}else{
	AllTypes.push(Coin);
	var Allinfo = Coin.split(":");
	AllTypesJSON.push({ALL: Coin+":"+CoinName, CoinNames: CoinName, Exchange: Allinfo[0], Pair: Allinfo[1],IMGfile: IMG});
	}}
	var Query_Bittrex = new Parse.Query(Bittrex);
	Query_Bittrex.exists("Chart");
	Query_Bittrex.limit(250);
	Query_Bittrex.include("CryptoCurrency");
    Query_Bittrex.find().then(function(BittrexCoins){
	for(var i in BittrexCoins){
    var Coin = BittrexCoins[i].get("Chart");
	var CoinName = BittrexCoins[i].get("CoinName");
	var Pointer = BittrexCoins[i].get("CryptoCurrency");
	var IMG = Pointer.get("IMGfile");
	if(AllTypes.indexOf(Coin) > -1){}else{
	AllTypes.push(Coin);
	var Allinfo = Coin.split(":");
	AllTypesJSON.push({ALL: Coin+":"+CoinName, CoinNames: CoinName, Exchange: Allinfo[0], Pair: Allinfo[1],IMGfile: IMG});
	}}

var options = {
	data: AllTypesJSON,
	list: {
		maxNumberOfElements: 12,
		match: {
			enabled: true
		},
        onClickEvent: function() {
			let coin  = $("#SearchCrypto").getSelectedItemData().IMGfile;
            let ALL  = $("#SearchCrypto").getSelectedItemData().ALL;
            var alltosplit = ALL.split(':');
            var link = "crypto.html#"+coin+"#"+alltosplit[0]+":"+alltosplit[1];
            location.href = link;
            

		}
        
	},
	getValue: "ALL",
	template: {
		type: "custom",
		method: function(value, item) {
			return "<img class='imgsearch' src='coins/"+item.IMGfile+".png'><b>" + item.CoinNames + "</b> | " + item.Pair + " | " + item.Exchange;
		}
	}
};
$("#SearchCrypto").easyAutocomplete(options); 
});
});
}


  
$( document ).ready(function() {
    $('#inputFriends').bind('input', function() { 
    var inputF = $(this).val();
    if(inputF.length >= 3){
    FindFriend(inputF);
    }else if(inputF.length == 0){
        $(".searched").html('');
    }else{
        $(".searched").html('<i class="fa fa-circle-o-notch fa-spin" style="font-size:10px"></i>');
    }
});
});
    