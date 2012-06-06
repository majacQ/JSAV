(function() {
  module("datastructures.list", {  });
  
  var testListValues = function(list, values) {
    var node = list.first(),
        i = 0,
        l = list.size();
    equal(l, values.length, "Comparing size of list and values");
    while (node) { // test node next
      deepEqual(values[i], node.value(), "Testing index " + i + " of values " + values);
      i++;
      node = node.next();
    }
    equal(i, l); // list had as many nodes as expected
    for (i = 0; i < l; i++) { // test with get
      deepEqual(values[i], list.get(i).value(), "Testing index " + i + " of values " + values);
    }
    // test last value
    deepEqual(values[l-1], list.last().value(), "Testing last value of " + values);
  };

  test("List creation and changing first", function() {
    var av = new JSAV("emptycontainer"),
        list = av.ds.list();
    ok(list, "List created successfully");
    deepEqual(list.first(), undefined);
    list.first("0");
    testListValues(list, ["0"]);
    av.step();
    list.first(1);
    testListValues(list, [1, "0"]);
    av.step();
    list.first(list.newNode(2));
    testListValues(list, [2, 1, "0"]);
    av.recorded();
    
    $.fx.off = true; // turn off animation effects
    deepEqual(list.first(), undefined);
    ok(av.forward());
    testListValues(list, ["0"]);
    ok(av.forward());
    testListValues(list, [1, "0"]);
    ok(av.forward());
    testListValues(list, [2, 1, "0"]);
    
    av.begin().end();
    deepEqual(list.first().value(), 2);
  });

  test("List add/get", function() {
    var av = new JSAV("emptycontainer"),
        list = av.ds.list();
    list.add(0, true);
    testListValues(list, [true]);
    av.step();
    
    list.add(1, false);
    testListValues(list, [true, false]);
    av.step();
    
    list.add(0, "hevonen");
    testListValues(list, ["hevonen", true, false]);
    av.step();
    
    equal(list.size(), 3);
    // test adding/getting outside of list
    list.add(-1, "pieni");
    deepEqual(list.get(-1), undefined);
    testListValues(list, ["hevonen", true, false]);
    
    list.add(4, "suuri");
    deepEqual(list.get(4), undefined);
    testListValues(list, ["hevonen", true, false]);
    
    // test invalid indices
    deepEqual(list.get("kissa"), undefined);
    deepEqual(list.get(false), undefined);
    list.add("stringindex", "value");
    testListValues(list, ["hevonen", true, false]);
    av.recorded();
    $.fx.off = true; // turn off animation effects
    
    ok(av.forward());
    testListValues(list, [true]);
    ok(av.forward());
    testListValues(list, [true, false]);
    ok(av.forward());
    testListValues(list, ["hevonen", true, false]);
    ok(av.backward());
    testListValues(list, [true, false]);
    ok(av.backward());
    testListValues(list, [true]);

  });

  test("List remove", function() {
    var av = new JSAV("emptycontainer"),
        list = av.ds.list();
    for (var i = 0; i < 6; i++) {
      list.first(i);
    }
    equal(list.size(), 6);
    testListValues(list, [5, 4, 3, 2, 1, 0]);
    av.step();
    
    list.remove(2);
    testListValues(list, [5, 4, 2, 1, 0]);
    av.step();
    
    list.remove(4);
    testListValues(list, [5, 4, 2, 1]);
    av.step();
    
    list.remove(0);
    testListValues(list, [4, 2, 1]);
    av.step();

    list.removeFirst();    
    testListValues(list, [2, 1]);
    av.step();
    
    list.removeLast();    
    testListValues(list, [2]);
    av.recorded();
    $.fx.off = true; // turn off animation effects

    ok(av.forward());
    testListValues(list, [5, 4, 3, 2, 1, 0]);
    ok(av.forward());
    testListValues(list, [5, 4, 2, 1, 0]);
    ok(av.forward());
    testListValues(list, [5, 4, 2, 1]);
    ok(av.forward());
    testListValues(list, [4, 2, 1]);
    ok(av.forward());
    testListValues(list, [2, 1]);
    ok(av.forward());
    testListValues(list, [2]);

  });

// highlight
// css

  test("Test click event", function() {
    expect(9);
    var handler1 = function(event) {
      ok(event);
      equals(this.value(), 0);
    };
    var handler2 = function(myval, event) {
      equals(myval, "kissa");
      ok(event);
      equals(this.value(), 2);
    }
    var handler3 = function(myval, myval2, event) {
      equals(myval, "kissa");
      equals(myval2, "koira");
      ok(event);
      equals(this.value(), 1);
    }
  	var av = new JSAV("arraycontainer"),
	      list1 = av.ds.list(),
	      list2 = av.ds.list(),
	      list3 = av.ds.list();
    var setup = function(list) {
      list.addFirst(0);
      list.addFirst(1);
      list.addFirst(2);
    }
    setup(list1); setup(list2); setup(list3);
    list1.click(handler1);
    list2.click(["kissa"], handler2);
    list3.click(["kissa", "koira"], handler3);
    list1.element.find(".jsavnode:eq(2)").click();
    list2.element.find(".jsavnode:eq(0)").click();
    list3.element.find(".jsavnode:eq(1)").click();
  });

  test("Test on event binding and custom events", function() {
    expect(9);
    var handler1 = function(event) {
      ok(event);
      equals(this.value(), 0);
    };
    var handler2 = function(myval, event) {
      equals(myval, "kissa");
      ok(event);
      equals(this.value(), 2);
    }
    var handler3 = function(myval, myval2, event) {
      equals(myval, "kissa");
      equals(myval2, "koira");
      ok(event);
      equals(this.value(), 1);
    }
	  var av = new JSAV("arraycontainer"),
	      list1 = av.ds.list(),
	      list2 = av.ds.list(),
  	    list3 = av.ds.list();
    var setup = function(list) {
      list.addFirst(0);
      list.addFirst(1);
      list.addFirst(2);
    }
    setup(list1); setup(list2); setup(list3);
    list1.on("jsavclick", handler1);
    list2.on("jsavclick", "kissa", handler2);
    list3.on("jsavclick", ["kissa", "koira"], handler3);
    list1.element.find(".jsavnode:eq(2)").trigger("jsavclick");
    list2.element.find(".jsavnode:eq(0)").trigger("jsavclick");
    list3.element.find(".jsavnode:eq(1)").trigger("jsavclick");
  });
})();