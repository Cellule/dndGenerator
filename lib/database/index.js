var DB = require("./DB");

var listsDb = new DB();
var todosDb = new DB();
(function() {
  var uuid = require("uuid");
  // Initial data
  var mylist = [uuid.v4(), uuid.v4(), uuid.v4()];
  var otherlist = [uuid.v4()];
  listsDb.set("mylist", mylist);
  listsDb.set("otherlist", otherlist);
  todosDb.set(mylist[0], {
    text: "Hello World"
  });
  todosDb.set(mylist[1], {
    text: "Eat something"
  });
  todosDb.set(mylist[2], {
    text: "Nothing"
  });
  todosDb.set(otherlist[0], {
    text: "12345679"
  });
}());

export default {
  todo: todosDb,
  list: listsDb
};
